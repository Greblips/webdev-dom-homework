
const addForm = document.querySelector('input');
const addComment = document.getElementById("add-button");
const removeComment = document.getElementById("remove-comment");
const listElement = document.getElementById("comments");
const nameInputElement = document.getElementById("name-input");
const commentInputElement = document.getElementById("comment-input");
const mainForm = document.querySelector(".add-form");
const studentElements = document.querySelectorAll(".comment");
const likeButton = document.querySelectorAll(".like-button");
const textarea = document.querySelectorAll('.add-form-text')
const waitLoadComments = document.getElementById("loaderComments");
const pushComments = document.getElementById("PushCommentsText");


pushComments.style.display = "none"
waitLoadComments.style.display = "flex";

// функция для даты
function getDate(date) {
  const options = {
      year: '2-digit',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
  }
  const newDate = new Date(date);
  return newDate.toLocaleString('ru-RU', options).replace(',', '');
}


 let comments = [];



// функция Данные с сервера
const fetchAndRenderTasks = () =>{
 return fetch("https://webdev-hw-api.vercel.app/api/v1/Kerimov-Evgeny/comments", {
  method: "GET"
})
  .then((response) => {
     if (response.status === 500) {
      throw new Error("Сервер сломался, попробуй позже")};
     return response.json()
  })

  .then((responseData) => {
    comments = responseData.comments;
    waitLoadComments.style.display = "none";
    renderComments();
  })

  .catch((error) => {
    if (error.message === "Сервер сломался, попробуй позже") {
      alert('Сервер упал')
      return;     
    }

})
 

}

fetchAndRenderTasks()



// Функция удаления последнего комментария
function delComment() {
  comments.pop()
    renderComments();
}

// Отчистка данных с поля
function delValue() {
  nameInputElement.value = "";
  commentInputElement.value = "";
};

// Функция для имитации запросов в API

function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}


// Добавление лайка
function addLike () {
  const likeButtons = listElement.querySelectorAll('.like-button');
  for(let likeButton of likeButtons){

    likeButton.addEventListener('click', ( event) => {
      event.stopPropagation()
          const index = likeButton.dataset.index;
          likeButton.classList.add('-loading-like')
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





// // Редактирование  
// function editText (event ) {
  
//   const editButtons = listElement.querySelectorAll('.edit_comment');
//   for(let editButton of  editButtons){

//     editButton.addEventListener('click', (event) => {
//       event.stopPropagation()
//           const index = editButton.dataset.index;

//             if (comments[index].isEdit === false) {
//                 comments[index].isEdit = true;    
//           } else {

//           let currentTextarea = document.querySelectorAll('.comment') [index].querySelector('textarea');

//             comments[index].isEdit = false;
//             comments[index].comment = safeInputText(currentTextarea.value);
//           }
//           renderComments();
//       })
//   } 
// }



// Добавление комментария  к инпуту

function reComment () {
  
 const allComments = document.querySelectorAll('.comment')
 for(let comment of allComments){
  comment.addEventListener('click', (event)=>{
    event.stopPropagation()
    const nameUser = comment.dataset.name;
    const userComments = comment.dataset.comment;
    commentInputElement.value =` >${userComments} \n${nameUser} <\n`
    
  })
 
 }
}

// Функция обезопасить ввод данных
function safeInputText(str) {
    return str.replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}



// Рендер разметки

function renderComments() {
  
  const userHtml = comments.map((user, index) => {
    return `<li class="comment"  data-name="${user.author.name}" data-comment="${user.text}">
    <div class="comment-header">
      <div>${user.author.name}</div>
      <div>${getDate(user.date)}</div>
    </div>
    <div class="comment-body" >
   <div class ="comment-text"> ${user.text} </div>
    </div>
    <div class="comment-footer">
      <div class="likes">
        <span class="likes-counter">${user.likes}</span>
        <button data-index="${index}"  class="${user.isLiked ? 'like-button -active-like' : 'like-button'}"></button>
    
      </div>
    </div>
  </li>`
  }).join('')

  listElement.innerHTML = userHtml;
  addLike()  // лайки
  reComment() // Комментирование поста

}





// Добавление комментария

addComment.addEventListener("click", () => {

  if (nameInputElement.value === "" || commentInputElement.value === "") {
    nameInputElement.classList.add("error");
    commentInputElement.classList.add("error");
    nameInputElement.placeholder = 'Введите имя';
    commentInputElement.placeholder = 'Введите комментарий';

   
    buttonBlock()
    return;  
  } 

    function pushComment(){
      fetch('https://webdev-hw-api.vercel.app/api/v1/Kerimov-Evgeny/comments', {
        method: "POST",
    
        body: JSON.stringify({
            date: new Date,
            likes: 0,
            isLiked: false,
            text: safeInputText(commentInputElement.value),
            name: safeInputText(nameInputElement.value),
            forceError: true
          })
    
          })
          .then((response) => {
            if (response.status === 400){
              throw new Error("Слишком короткая строчка");
            } 
            if (response.status === 500) {
              pushComment();
              throw new Error("Сервер сломался, попробуй позже")
            }
              mainForm.style.display = "none";
              pushComments.style.display = "flex"
              return fetchAndRenderTasks()
    
          })
      
          .then(()=>{     
            mainForm.style.display = "flex";
            pushComments.style.display = "none"
            delValue(); 
          })
    
          .catch((error) => {
            if (error.message === "Сервер сломался, попробуй позже") {
              console.warn("Сервер не работает, попробуйте позже")
              mainForm.style.display = "flex";
              pushComments.style.display = "none"
                return;
            }
            if (error.message === "Слишком короткая строчка") {
                alert("Имя и комментарий должны быть не короче 3 символов")
                mainForm.style.display = "flex";
                pushComments.style.display = "none"
                return;
            }
            mainForm.style.display = "flex";
            pushComments.style.display = "none"
            alert("Кажется, у вас сломался интернет, попробуйте позже");
            return;
           
        })
       
    
    }
    
    pushComment()
    nameInputElement.classList.remove("error");
    commentInputElement.classList.remove("error");
    const oldListHtml = listElement.innerHTML;
    renderComments();
 
});




removeComment.addEventListener("click", () => {
  delComment()
})

// Блокировка кнопки ввода()
const buttonBlock = () => {
  document.querySelectorAll("#name-input,#comment-input").forEach((el) => {
    el.addEventListener("input", () => {
      if (document.getElementById("name-input").value === '' || document.getElementById("comment-input").value === '')
        document.getElementById("add-button").disabled = true;
      else
        document.getElementById("add-button").disabled = false;
    });
  });
}




// Ввод по нажатию клавиши Enter
mainForm.addEventListener('keyup', (event) => {

  if (event.code === "Enter"  ) {
    addComment.click();
   
    delValue();
  }
});






