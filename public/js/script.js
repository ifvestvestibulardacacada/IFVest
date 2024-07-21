/*==================== SHOW NAVBAR ====================*/
const showMenu = (headerToggle, navbarId) =>{
   const toggleBtn = document.getElementById(headerToggle),
   nav = document.getElementById(navbarId)
   
   // Validate that variables exist
   if(headerToggle && navbarId){
       toggleBtn.addEventListener('click', ()=>{
           // We add the show-menu class to the div tag with the nav__menu class
           nav.classList.toggle('show-menu')
           // change icon
           toggleBtn.classList.toggle('bx-x')
       })
   }
}
showMenu('header-toggle','navbar')

/*==================== LINK ACTIVE ====================*/
const linkColor = document.querySelectorAll('.nav__link')

function colorLink(){
   linkColor.forEach(l => l.classList.remove('active'))
   this.classList.add('active')
}

linkColor.forEach(l => l.addEventListener('click', colorLink))


let videoList = document.querySelectorAll('.video-list-container .list');

videoList.forEach(vid =>{
   vid.onclick = () =>{
      videoList.forEach(remove =>{remove.classList.remove('active')});
      vid.classList.add('active');
      let src = vid.querySelector('.list-video').src;
      let title = vid.querySelector('.list-title').innerHTML;
      document.querySelector('.main-video-container .main-video').src = src;
      document.querySelector('.main-video-container .main-video').play();
      document.querySelector('.main-video-container .main-vid-title').innerHTML = title;
   };
});