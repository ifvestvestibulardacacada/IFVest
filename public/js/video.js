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

let videoList = document.querySelectorAll('.video-list-container .list');
let mainVideo = document.getElementById('main-video');

videoList.forEach(vid => {
   vid.addEventListener('click', () => {
      videoList.forEach(remove => {
         remove.classList.remove('active');
      });
      vid.classList.add('active');
      let youtubeId = vid.getAttribute('data-youtube-id');
      let youtubeUrl = `https://www.youtube.com/embed/${youtubeId}`;
      mainVideo.src = youtubeUrl;
      mainVideo.src += "?autoplay=1"; // Autoplay the video
      mainVideo.title = vid.querySelector('.list-title').textContent;
      let title = vid.querySelector('.list-title').innerHTML;
      document.querySelector('.main-video-container .main-vid-title').innerHTML = title;
   });
});


