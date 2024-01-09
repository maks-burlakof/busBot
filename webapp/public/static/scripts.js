let numPages = 0;
let currentPage = 0;

function renderPage() {
   console.log(`Page ${currentPage} of ${numPages}`);
}

function changePage(direction) {
   if (direction === 'next') {
      if (currentPage >= numPages)  {
         return;
      }
      currentPage++;
      // show back button
      // check if main button should be hidden
   } else if (direction === 'prev') {
      if (currentPage <= 0)  {
         return;
      }
      currentPage--;
      // show main button with text - next
   }
   $('.items').css('transform', `translateX(${-currentPage*100}%) translateX(${-8-16*(currentPage)}px)`);
   console.log('Page changed');
   renderPage();
}

$(document).ready(function() {
   if (!$('.items').length) {
      return;
   }
   numPages = $(".items").find(".item").length - 1;
   currentPage = 0;
   renderPage();
   $('#mainButton').click(() => {
      changePage('next');
   });
   $('#backButton').click(() => {
      changePage('prev');
   });
});