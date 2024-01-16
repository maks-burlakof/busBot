let fetchedData = null;
let fetchedRoute = null;

class URLParam {
   static get(param, url) {
      if (!url) {
         url = window.location.href;
      }
      return new URL(url).searchParams.get(param);
   }

   static set(param, value) {
      let urlObj = new URL(window.location.href);
      urlObj.searchParams.set(param, value);
      window.history.replaceState({path: `${urlObj}`}, '', urlObj);
   }

   static remove(param) {
      let urlObj = new URL(window.location.href);
      urlObj.searchParams.delete(param);
      window.history.replaceState({path: `${urlObj}`}, '', urlObj);
   }
}

let buttonModes = {
   'search': 'Найти',
   'buy': 'Заказать',
   'track': 'Отслеживать',
}

function isAllowSearching() {
   if (URLParam.get('date') && URLParam.get('from') && URLParam.get('to')) {
      Telegram.WebApp.MainButton.setParams({
         'text': buttonModes['search'],
         'is_active': true,
         'is_visible': true,
      });
      Telegram.WebApp.MainButton.onClick(renderSearchResults);
      return true;
   } else {
      Telegram.WebApp.MainButton.setParams({
         'text': buttonModes['search'],
         'is_active': false,
         'is_visible': true,
      });
      return false;
   }
}

function renderSearchIndex() {
   $('.items').css('transform', `translateX(0%) translateX(-8px)`);
   Telegram.WebApp.BackButton.hide();
   isAllowSearching();
}

async function makeSearchRequest() {
   fetchedRoute = {
      'date': URLParam.get('date'),
      'from': URLParam.get('from'),
      'to': URLParam.get('to'),
   }
   Telegram.WebApp.MainButton.disable();
   Telegram.WebApp.MainButton.showProgress();
   let response = await fetch(`/api/search?date=${fetchedRoute['date']}&city_from=${fetchedRoute['from']}&city_to=${fetchedRoute['to']}`);
   if (!response.ok) {
      Telegram.WebApp.HapticFeedback.notificationOccurred('error');
      Telegram.WebApp.showConfirm('Не удалось выполнить запрос... Перезагрузим страничку?', location.reload);
      return;
   }
   fetchedData = await response.json();
   Telegram.WebApp.MainButton.hideProgress();
   Telegram.WebApp.MainButton.enable();
}

async function renderSearchResults() {
   let searchedRoute = {
      'date': URLParam.get('date'),
      'from': URLParam.get('from'),
      'to': URLParam.get('to'),
   }
   $('#searchRouteText').html(`${searchedRoute['from']} <i class="fa-solid fa-arrow-right-long"></i> ${searchedRoute['to']}<br>${searchedRoute['date']}`);
   $('#searchRouteContainer').html('');
   $('.items').css('transform', `translateX(-100%) translateX(-24px)`);
   Telegram.WebApp.HapticFeedback.impactOccurred('light');
   Telegram.WebApp.BackButton.show();
   Telegram.WebApp.BackButton.onClick(renderSearchIndex);
   if (!fetchedData || fetchedRoute !== searchedRoute) {
      isAllowSearching();
      await makeSearchRequest();
   }
   for (let i = 1; i <= Object.keys(fetchedData['results']).length; i++) {
      let data = fetchedData['results'][i];
      $('#searchRouteContainer').append(`
         <div class="input bus" data-size="xl">
            <div class="bus-col-1">
               <h4>${data['departure_time']} <span><i class="fa-solid fa-minus"></i> ${data['arrival_time']}</span></h4>
               <p>${data['free_seats_text']}${data['free_seats'] ? (', ' + data['price'] + ' р.') : ''}</p>
            </div>
            <div class="bus-col-2">
               <h3>${data['free_seats'] ? ('<i class="fa-solid fa-circle-check" style="color: #4bd501;"></i>') : ('<i class="fa-solid fa-circle-xmark" style="color: #ff0000;"></i>')}</h3>
               ${data['free_seats'] ? ('<a>Заказать <i class="fa-solid fa-angle-right"></i></a>') : ('<a>Отслеживать <i class="fa-solid fa-angle-right"></i></a>')}
            </div>
         </div>
`     );
   }
   Telegram.WebApp.MainButton.hide();
}

async function renderBusDetails() {
   let searchedRoute = {
      'date': URLParam.get('date'),
      'from': URLParam.get('from'),
      'to': URLParam.get('to'),
   }
   let searchedTime = URLParam.get('time');
   $('#busDetailsText').html(`${searchedRoute['from']} <i class="fa-solid fa-arrow-right-long"></i> ${searchedRoute['to']}<br>${searchedRoute['date']} <span>(Нд)</span><br>${searchedTime}`);
   $('#busDetailsContainer').html('');
   $('.items').css('transform', `translateX(-200%) translateX(-40px)`);
   Telegram.WebApp.HapticFeedback.impactOccurred('light');
   Telegram.WebApp.BackButton.show();
   Telegram.WebApp.BackButton.onClick(renderSearchResults);
   if (!fetchedData || fetchedRoute !== searchedRoute) {
      isAllowSearching();
      await makeSearchRequest();
   }
   for (let i = 1; i <= Object.keys(fetchedData['results']).length; i++) {
      let data = fetchedData['results'][i];
      if (data['departure_time'] === searchedTime) {
         $('#busDetailsText').append(`<span> - ${data['arrival_time']}</span>`);
         $('#busDetailsContainer').html(`
            <p>${data['free_seats_text']}<br>${data['price']} р.</p>
            <p>${data['driver']['name']}<br>${data['driver']['phone']}</p>
            <p>${data['name']}</p>
            <div class="content content-rounded" style="background: var(--tok-stinger); margin-top: 0;">
               <h3>Остановки</h3>
               ${$('<p>').text(data['departure_stops'].map(item => `${item.name}: ${item.time}`).join(', '))}
            </div>
         `);
         if (data['free_seats']) {
            Telegram.WebApp.MainButton.setParams({
               'text': buttonModes['buy'],
               'is_active': true,
               'is_visible': true,
            });
         } else {
            Telegram.WebApp.MainButton.setParams({
               'text': buttonModes['track'],
               'is_active': true,
               'is_visible': true,
            });
         }
         return;
      }
   }
   $('#busDetailsContainer').html(`Информации об этом рейсе не найдено`);
   Telegram.WebApp.HapticFeedback.notificationOccurred('error');
   Telegram.WebApp.showConfirm('Информация по этому рейсу отсутствует. Перейти в поиск?', () => {
      window.location.pathname = '/find';
      window.location.search = '';
   });
}

$(document).ready(function() {
   $('html').attr('data-theme', 'dark')
   if (Telegram.WebApp.initData) {
      $('html').data('theme', 'dark');
   }

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
            Telegram.WebApp.HapticFeedback.selectionChanged();
            let chosenDate = dates['selectedDates'][0];
            if (chosenDate) {
               URLParam.set('date', chosenDate);
               isAllowSearching();
            } else {
               URLParam.remove('date');
               isAllowSearching();
            }
         },
      },
      settings: {
         lang: 'ru',
      },
      CSSClasses: {
         calendar: 'my-vanilla-calendar',
         dayBtn: 'my-vanilla-calendar-day__btn',
         dayBtnNext: 'my-vanilla-calendar-day__btn_next',
      }
   });

   if (URLParam.get('date')) {
      calendar.settings.selected.dates = [URLParam.get('date')];
   }
   calendar.init();
   if (URLParam.get('from')) {
      $('#cityFrom').val(URLParam.get('from'));
   } else {
      URLParam.set('from', $('#cityFrom').val());
   }
   if (URLParam.get('to')) {
      $('#cityTo').val(URLParam.get('to'));
   } else {
      URLParam.set('to', $('#cityTo').val());
   }

   if (URLParam.get('date') && URLParam.get('from') && URLParam.get('to') && URLParam.get('time')) {
      renderBusDetails();
   } else if (URLParam.get('date') && URLParam.get('from') && URLParam.get('to')) {
      renderSearchResults();
   } else {
      renderSearchIndex();
   }

   Telegram.WebApp.ready();
   Telegram.WebApp.expand();

   $('#cityFrom').change(function () {
      Telegram.WebApp.HapticFeedback.selectionChanged();
      URLParam.set('from', $('#cityFrom').val());
      isAllowSearching();
   });
   $('#cityTo').change(function () {
      Telegram.WebApp.HapticFeedback.selectionChanged();
      URLParam.set('to', $('#cityTo').val());
      isAllowSearching();
   });
});