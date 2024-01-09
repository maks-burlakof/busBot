let chosenDate = undefined;

let buttonModes = {
   'search': 'Найти',
   'buy': 'Заказать',
   'track': 'Отслеживать',
}

function allowSearching() {
   Telegram.WebApp.MainButton.setParams({
      'text': buttonModes['search'],
      'is_active': true,
      'is_visible': true,
   });
}

function disallowSearching() {
   Telegram.WebApp.MainButton.setParams({
      'text': buttonModes['search'],
      'is_active': false,
      'is_visible': true,
   });
}

function renderSearchIndex() {
   $('.items').css('transform', `translateX(0%) translateX(-8px)`);
   // if date and routes are chosen
   disallowSearching();
}

async function makeSearchRequest() {
   let response = await fetch(`/api/search?date=${chosenDate}&city_from=${$("cityFrom")}&city_to=${$("cityTo")}`);
   if (response.status !== 200) {
      Telegram.WebApp.HapticFeedback.notificationOccurred('error');
      Telegram.WebApp.showConfirm('Не удалось выполнить запрос... Перезагрузим страничку?', location.reload);
   }
}

function renderSearchResults() {
   Telegram.WebApp.MainButton.showProgress();
   //
   $('.items').css('transform', `translateX(100%) translateX(-24px)`);
   Telegram.WebApp.MainButton.hideProgress();
   Telegram.WebApp.MainButton.hide();
   Telegram.WebApp.BackButton.show();
   Telegram.WebApp.BackButton.onClick(renderSearchIndex);
}

$(document).ready(function() {
   Telegram.WebApp.ready();
   Telegram.WebApp.expand();
   renderSearchIndex();

   //calendar
   let today = new Date;
   const calendar = new VanillaCalendar('#calendar', {
      type: 'default',
      date: {
         min: today.toISOString().split('T')[0],
         max: new Date(new Date().setFullYear(today.getFullYear() + 1)).toISOString().split('T')[0],
         today: today,
      },
      actions: {
         clickDay(event, dates) {
            // haptic
            chosenDate = dates['selectedDates'][0];
            console.log(chosenDate);
            if (chosenDate) {
               allowSearching();
            } else {
               disallowSearching();
            }
         },
      },
      settings: {
         lang: 'ru',
      },
   });
   calendar.init();
});