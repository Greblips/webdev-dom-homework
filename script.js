import { getCommentsList, publicComment } from "./api.js";
import {safeInputText,delay} from "./secondaryFunc.js"
import { renderLoginComponent } from "./login-component.js";
import { formatDate } from "./lib/formatDate/formatDate.js";

 let token = null;
 let comments = [];
 let name;





// const waitCommentMessage = document.getElementById("waitComment");
// /* waitCommentMessage.style.display = "inline"; */



//get запрос
const fetchGetAndRender = () => {
  return getCommentsList({token})
    .then((responseData) => {
      comments = responseData.comments;
      
      renderComments();
    })
    .catch((error) => {
      /* waitCommentMessage.style.display = "none"; */
      if (error === "Сервер упал") {
        alert("Сервер сломался, попробуй позже");
      } else {
        alert("Кажется, у вас сломался интернет, попробуйте позже");
      }
      console.warn(error);
    });
};

//рендер-функция

 export const renderComments = () => {
  const appEl = document.getElementById("app");

  
    if (!token) {
      renderLoginComponent({
        comments,
        appEl,
       
        setToken: (newToken) => {
          token = newToken;
        },
        setName: (newName) => {
          name = newName;
          
        },
        renderComments,
      });
      return;
    }
  


  const commentsHtml =
  comments.map((user, index,) => {
    const date = new Date(user.date)
    return `<li class="comment"  data-name="${user.author.name}" data-comment="${user.text}" data-id="${user.id}" >
    <div class="comment-header">
      <div>${user.author.name}</div>
      <div>${formatDate(date)}</div>
    </div>
    <div class="comment-body" data-comments="${index}" >
   <div class ="comment-text"> ${user.text} </div>
    </div>
    <div class="comment-footer">
      <div class="likes">
        <span class="likes-counter">${user.likes}</span>
        <button  data-heart="${index}" class="${user.isLiked ? 'like-button -active-like' : 'like-button'}"></button>
    
      </div>
    </div>
  </li>`
  }).join('')

  const appHtml = `
            <div class="container">
              <p id = 'waitComment' style="display: none">Комментарии загружаются...</p>
              <ul id="list" class="comments">
                ${commentsHtml}
              </ul>
              <p id = 'addingComment' style="display: none">Комментарий добавляется...</p>
              <div class="add-form">
              
              <input
              value = "${name}"
                type="text"
                id="name-input"
                class="add-form-name"
                placeholder="Введите ваше имя" disabled
              />
              <textarea
                type="textarea"
                id="text-input"
                class="add-form-text"
                placeholder="Введите ваш комментарий"
                rows="4"
              ></textarea>
              <div class="add-form-row">
                <button id="add-button" class="add-form-button">Написать</button>
                <button data-id = 'id' id="delete-button" class="add-form-button">
                  Удалить комментарий
                </button>
              </div>
            </div>
          </div>`;

  appEl.innerHTML = appHtml;

  
// Переменные
  const buttonElement = document.getElementById("add-button");
  const deleteButtonElement = document.getElementById("delete-button");
  // const listElement = document.getElementById("list");
  const nameInputElement = document.getElementById("name-input");
  const textInputElement = document.getElementById("text-input");
  const mainForm = document.querySelector(".add-form");
  const addCommentText = document.getElementById("addingComment");
  const likeButtons = appEl.querySelectorAll('.like-button');

  //Добавление комментария, POST запрос с GET

  buttonElement.addEventListener("click", () => {
    nameInputElement.classList.remove("error");
    textInputElement.classList.remove("error");

    if (nameInputElement.value === "" || textInputElement.value === "") {
      nameInputElement.classList.add("error");
      textInputElement.classList.add("error");
      return;
    }
    addCommentText.style.display = "inline";
    mainForm.style.display = "none";
    buttonElement.disabled = true;
    buttonElement.textContent = "Загружаю...";

    publicComment({
      name: safeInputText(nameInputElement.value),
      text: safeInputText(textInputElement.value),
      date: formatDate(new Date()),
      forceError: true,
      token,
    })
      .then(() => {
        return fetchGetAndRender();
      })
      .then(() => {
        addCommentText.style.display = "none";
        mainForm.style.display = "flex";
        buttonElement.disabled = false;
        buttonElement.textContent = "Написать";
        nameInputElement.value = "";
        textInputElement.value = "";
      })
      .catch((error) => {
        addCommentText.style.display = "none";
        mainForm.style.display = "flex";
        buttonElement.disabled = false;
        buttonElement.textContent = "Написать";
        if (error === "Короткий текст") {
          alert("Имя и комментарий должны быть не короче 3 символов");
        } else if (error === "Сервер упал") {
          alert("Сервер сломался, попробуй позже");
        } else {
          alert("Кажется, у вас сломался интернет, попробуйте позже");
        }
        console.warn(error);
      });

    renderComments();
  });
  function setData(btn){
    let objComment 
    const id = btn.closest('.comment').dataset.id
    comments.forEach(item => item.id === id ? objComment = item : item)
    const response = fetch(`https://webdev-hw-api.vercel.app/api/v2/Kerimov-Evgenii/comments/${id}/toggle-like`, {
      method: 'POST',
      body : JSON.stringify(objComment),
      headers : {
        authorization : token
      }
    }).then(data => data.json()).then(data => {
      console.log(data)
    })
    
  }

  function addLike () {
  
    for(let likeButton of likeButtons){
  
      likeButton.addEventListener('click', ( event) => {
        event.stopPropagation()
            const index = likeButton.dataset.heart;
            likeButton.classList.add('-loading-like')
            setData(likeButton)
            delay(2000).then(()=> {
              if (!comments[index].isLiked) {
                comments[index].isLiked = true;
                comments[index].likes +=1;
              } else {
                comments[index].isLiked = false;
                comments[index].likes -=1;
              }
              renderComments();
            })
  
        })
    }
  } 

  // блокировка кнопки
  const validateInput = () => {
    if (nameInputElement.value === "" || textInputElement.value === "") {
      buttonElement.disabled = true;
    } else {
      buttonElement.disabled = false;
    }
  };
  const buttonBlock = () => {
    validateInput();
    document.querySelectorAll("#name-input,#text-input").forEach((el) => {
      el.addEventListener("input", () => {
        validateInput();
      });
    });
  };

  // ввод по кнопке enter
  function pushCommentwithEnter(){
    mainForm.addEventListener('keyup', (event) => {
  
      if (event.code === "Enter"  ) {
        buttonElement.click();
      }
    });  
  }


  
  // удаление последнего комментария
  function deleteComment(token,comments) {

    return fetch(
      "https://webdev-hw-api.vercel.app/api/v2/Kerimov-Evgenii/comments/" +
        comments[comments.length - 1].id,
      {
        method: "DELETE",

        headers: {
          authorization: token,
        },
      }
    ).then((response) => {
      if (response.status === 404){
        throw new Error ("Ошибка удаления")
      }
      comments.pop();
      renderComments();
      return response.json();
    }).catch(error =>{
      alert(error.message)
    })
  }

 deleteButtonElement.addEventListener('click', () =>{
  deleteComment(token, comments);
 })

  //Комментарий на комментарий
 function reComment () {
  
    const allComments = document.querySelectorAll('.comment')
    for(let comment of allComments){
     comment.addEventListener('click', (event)=>{
       event.stopPropagation()
       textInputElement.value =` >${comment.dataset.comment} \n${comment.dataset.name} <\n`
       
     })
    
    }
   }

  addLike(); //Лайки
 
  pushCommentwithEnter(); //Отправка по Enter
  reComment(); //  Ответ на коммент
  buttonBlock(); // Блокировка кнопки

};

renderComments();
fetchGetAndRender();

