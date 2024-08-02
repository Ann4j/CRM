
import api from './api.js'
import dom from './dom.js'

const optionsValue = ['Не выбрано', 'Телефон', 'Доп.телефон', 'Email', 'Vk', 'Facebook', 'Другое'];
const arrayContactsClient = [];
const body = document.querySelector('body');
const table = document.querySelector('.table');
let btnDeletClient
let modalWindow
let filterClients = await api.serverClientsList();


//  поиска клиента
const inputSearch = document.getElementById('input__search');

async function findClients(text) {
  const params = new URLSearchParams();
  params.set("search", text);
  const responce = await fetch(`http://localhost:3000/api/clients?${params}`);
  return await responce.json();
}
async function handleInput() {
  filterClients = await findClients(inputSearch.value)
  table.innerHTML = '';
  dom.renderTableHeader(columns, table);
  dom.renderRowClient(filterClients, table, columns, sorts);
}

function debounce(callee, timeoutMs) {
  return function perform(...args) {
    let previousCall = this.lastCall

    this.lastCall = Date.now()

    if (previousCall && this.lastCall - previousCall <= timeoutMs) {
      clearTimeout(this.lastCallTimer)
    }

    this.lastCallTimer = setTimeout(() => callee(...args), timeoutMs)
  }
}

const debounceHandleInput = debounce(handleInput, 300)
inputSearch.addEventListener('input', debounceHandleInput);


// функции сортировки
const sorts = {};

async function sortColumn(key) {
  if (sorts[key] === 'asc') {
    sorts[key] = 'desc';
  } else {
    sorts[key] = 'asc';
  }
  table.innerHTML = '';
  dom.renderTableHeader(columns, table);
  console.log(filterClients)
  dom.renderRowClient(filterClients, table, columns, sorts);
}


// массив колонок
const columns = [
  {
    key: 'id',
    name: 'ID',
    format({ id }, cell) {
      let tableID = document.createElement('p');
      tableID.textContent = id.toString().substr(0, 6);
      cell.append(tableID);
    },
    sort: sortColumn
  },
  {
    key: 'fullname',
    name: 'Фамилия Имя Отчество',
    format({ name, surname, lastName }, cell) {
      let tableFullname = document.createElement('p');
      tableFullname.textContent = `${surname} ${name} ${lastName}`;
      cell.append(tableFullname);
    },
    sort: () => sortColumn('surname')
  },
  {
    key: 'createdAt',
    name: 'Дата и время создания',
    format({ createdAt }, cell) {
      const date = new Date(createdAt)
      let createDate = document.createElement('p');
      let createMin = document.createElement('p');

      let dd = date.getDate();
      if (dd < 10) dd = '0' + dd;

      let mm = date.getMonth();
      if (mm < 10) mm = '0' + mm;

      let yy = date.getFullYear();
      if (yy < 10) yy = '0' + yy;

      let hour = date.getHours()
      if (hour < 10) hour = '0' + hour;

      let min = date.getMinutes()
      if (min < 10) min = '0' + min;

      createDate.textContent = `${dd}.${mm}.${yy}`;
      createMin.textContent = `${hour}:${min}`;
      cell.classList.add('table__cell-time')
      cell.append(createDate);
      cell.append(createMin);
    },
    sort: sortColumn
  },
  {
    key: 'updatedAt',
    name: 'Последние изменения',
    format({ updatedAt }, cell) {
      const date = new Date(updatedAt);
      let changeDate = document.createElement('p');
      let changeMin = document.createElement('p');

      let dd = date.getDate();
      if (dd < 10) dd = '0' + dd;

      let mm = date.getMonth();
      if (mm < 10) mm = '0' + mm;

      let yy = date.getFullYear();
      if (yy < 10) yy = '0' + yy;

      let hour = date.getHours()
      if (hour < 10) hour = '0' + hour;

      let min = date.getMinutes()
      if (min < 10) min = '0' + min;

      changeDate.textContent = `${dd}.${mm}.${yy}`;
      changeMin.textContent = `${hour}:${min}`;
      cell.classList.add('table__cell-time')
      cell.append(changeDate);
      cell.append(changeMin);
    },
    sort: sortColumn
  },
  {
    key: 'contacts',
    name: 'Контакты',
    format({ contacts }, cell) {
      let type
      let value
      for (let contact of contacts) {
        type = contact.type;
        value = contact.value;
        let linkContack = document.createElement('a');
        linkContack.classList.add('link__contact');
        let svgContact
        if (type === 'Телефон' || type === 'Доп.телефон') {
          svgContact = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <use xlink:href="img/sprite.svg#phone"></use>
        </svg>`
        } else if (type === 'Email') {
          svgContact = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <use xlink:href="img/sprite.svg#mail"></use>
        </svg>`
        } else if (type === 'Facebook') {
          svgContact = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <use xlink:href="img/sprite.svg#fb"></use>
        </svg>`
        } else if (type === 'Vk') {
          svgContact = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <use xlink:href="img/sprite.svg#vk"></use>
        </svg>`
        } else {
          svgContact = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <use xlink:href="img/sprite.svg#client"></use>
        </svg>`
        }
        linkContack.insertAdjacentHTML("afterbegin", svgContact);
        linkContack.setAttribute('data-svgtel', `${type}: ${value}`)
        cell.append(linkContack)
      }
    },
  },
  {
    key: 'actions',
    name: 'Действия',
    format(client, cell) {
      let btnDeletInTable = document.createElement('button');
      let btnChangeInTable = document.createElement('button');
      btnDeletInTable.classList.add('table__btn');
      btnChangeInTable.classList.add('table__btn');
      btnChangeInTable.textContent = 'Изменить';
      btnDeletInTable.textContent = 'Удалить';
      let svgEdit = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <use xlink:href="img/sprite.svg#edit"></use>
    </svg>`
      btnChangeInTable.insertAdjacentHTML("afterbegin", svgEdit);
      let svgDelet = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <use xlink:href="img/sprite.svg#cancel-delet-table"></use>
    </svg>`
      btnDeletInTable.insertAdjacentHTML("afterbegin", svgDelet);

      cell.append(btnChangeInTable);
      cell.append(btnDeletInTable);

      // обработчик клика на кнопку удалить в таблица
      btnDeletInTable.addEventListener('click', () => {
        [btnDeletClient, modalWindow] = dom.renderModalWindiwDeletClient(body)

        // удаление самого клиента из таблицы и сервера
        btnDeletClient.addEventListener('click', async () => {
          await api.serverDeletClient(client.id)
          table.innerHTML = '';
          modalWindow.remove()
          dom.renderTableHeader(columns, table);
          dom.renderRowClient(await api.serverClientsList(), table, columns);
        })
      }
      )

      // обработчик клика на кнопку изменить и создание модального окна изменить
      btnChangeInTable.addEventListener('click', async () => {
        const modalWindowChange = document.createElement('div');
        modalWindowChange.classList.add('modal__change');
        dom.modalClose(modalWindowChange)

        const wrap = document.createElement('div');
        wrap.classList.add("modal__wrap");

        const containerModalWindowChange = document.createElement('div');
        containerModalWindowChange.classList.add('window');

        const windowHeader = document.createElement('div');
        windowHeader.classList.add('window__header');

        const windowTitle = document.createElement('h2');
        windowTitle.classList.add('window__title');
        windowTitle.textContent = 'Изменить данные';

        const windowSpanId = document.createElement('span');
        windowSpanId.classList.add('window__id');
        windowSpanId.textContent = `ID:${client.id.toString().substr(0, 6)}`;

        const windowBtn = document.createElement('button');
        windowBtn.classList.add('window__btn');
        let svgButtonCloseModal = `<svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
        <use xlink:href="img/sprite.svg#window_cancel"></use>
      </svg>`
        windowBtn.insertAdjacentHTML("afterbegin", svgButtonCloseModal);
        dom.modalCloseByClickBtn(modalWindowChange, windowBtn);

        const formChange = document.createElement('form');
        formChange.classList.add('window__form');
        formChange.setAttribute('id', 'form__add');

        const formInputs = document.createElement('div');
        formInputs.classList.add('form__inputs');

        const formInputSurname = document.createElement('input');
        formInputSurname.setAttribute('type', 'text');
        formInputSurname.setAttribute('placeholder', 'Фамилия');
        formInputSurname.classList.add('form__input');
        formInputSurname.name = 'surname';
        formInputSurname.value = client.surname;

        const formInputName = document.createElement('input');
        formInputName.type = 'text';
        formInputName.placeholder = 'Имя';
        formInputName.classList.add('form__input');
        formInputName.name = 'name';
        formInputName.value = client.name;

        const formInputLastname = document.createElement('input');
        formInputLastname.type = 'text';
        formInputLastname.placeholder = 'Отчество';
        formInputLastname.classList.add('form__input');
        formInputLastname.name = 'lastName';
        formInputLastname.value = client.lastName;

        const formCase = document.createElement('div');
        formCase.classList.add('form__case');

        const btnAddContact = document.createElement('button');
        btnAddContact.classList.add('form__btn-contact');
        btnAddContact.textContent = 'Добавить контакт';
        let svgBtnAddContact = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <use xlink:href="img/sprite.svg#add_contact"></use>
      </svg>`
        btnAddContact.insertAdjacentHTML("afterbegin", svgBtnAddContact);

        const btnSave = document.createElement('button');
        btnSave.classList.add('form__btn');
        btnSave.textContent = 'Сохранить';
        btnSave.setAttribute('form', 'form__add');

        const btnDeletClient = document.createElement('button');
        btnDeletClient.classList.add('form__btn-cancel');
        btnDeletClient.textContent = 'Удалить клиента';

        windowTitle.append(windowSpanId)
        formCase.append(btnAddContact);
        formInputs.append(formInputSurname);
        formInputs.append(formInputName);
        formInputs.append(formInputLastname);
        formChange.prepend(formInputs);
        formChange.append(formCase);
        windowHeader.prepend(windowTitle);
        windowHeader.append(windowBtn);
        containerModalWindowChange.prepend(windowHeader);
        containerModalWindowChange.append(formChange);
        containerModalWindowChange.append(btnSave);
        containerModalWindowChange.append(btnDeletClient);
        wrap.append(containerModalWindowChange)
        modalWindowChange.append(wrap);
        body.prepend(modalWindowChange)

        if (arrayContactsClient.length >= 10) {
          btnAddContact.style.display = "none";
        };

        // ренденр select and input для нового контакта
        btnAddContact.addEventListener('click', (e) => {
          e.preventDefault()
          let [selectContact, inputContact, containerContacts] = dom.caseContact(optionsValue, formCase);
          let contact = [selectContact, inputContact]
          arrayContactsClient.push(contact);
          let indexContact = arrayContactsClient.length - 1;
          contact.index = indexContact;

          inputContact.addEventListener('focus', () => {
            const btnDeletContact = document.createElement('button');
            btnDeletContact.classList.add('select__btn');
            let svgBtnDeletContact = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <use xlink:href="img/sprite.svg#cancel__contact"></use>
          </svg>`
            btnDeletContact.insertAdjacentHTML("afterbegin", svgBtnDeletContact);

            // удаление контакт
            btnDeletContact.addEventListener('click', (e) => {
              arrayContactsClient.splice(indexContact, 1)
              e.preventDefault()
              containerContacts.remove()
              console.log(arrayContactsClient)
            })
            containerContacts.append(btnDeletContact);
          }, { once: true })
          if (arrayContactsClient.length >= 10) {
            btnAddContact.style.display = "none";
          }
        })

        // достаем уже имебщиеся контакты
        for (let contact of client.contacts) {
          let [selectContact, inputContact, containerContacts] = dom.caseContact(optionsValue, formCase);
          let contactElement = [selectContact, inputContact]
          arrayContactsClient.push(contactElement);
          let indexContact = arrayContactsClient.length - 1;
          contactElement.index = indexContact;

          selectContact.value = contact.type;
          inputContact.value = contact.value;

          const btnDeletContact = document.createElement('button');
          btnDeletContact.classList.add('select__btn');
          let svgBtnDeletContact = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <use xlink:href="img/sprite.svg#cancel__contact"></use>
        </svg>`
          btnDeletContact.insertAdjacentHTML("afterbegin", svgBtnDeletContact);
          containerContacts.append(btnDeletContact);
          console.log(arrayContactsClient)
          // удаление контакт
          btnDeletContact.addEventListener('click', (e) => {
            arrayContactsClient.splice(indexContact, 1)
            e.preventDefault()
            containerContacts.remove()
            console.log(arrayContactsClient)
          })
          if (arrayContactsClient.length >= 10) btnAddContact.style.display = "none";
        }

        // обрабочтик кнопки сохранить изменения
        formChange.addEventListener('submit', async function (e) {
          // достаем данные из формы
          const formData = new FormData(formChange);
          const existingClient = Object.fromEntries(formData);
          //формируем объект с новым клиентом
          existingClient.contacts = arrayContactsClient.map(([select, input]) => ({ type: select.value, value: input.value }));
          api.changeClientServer(client.id, existingClient)

          //  рендерим таблицу с клиентом
          table.innerHTML = '';
          dom.renderTableHeader(columns, table);
          dom.renderRowClient(await api.serverClientsList(), table, columns, sorts);
          modalWindowChange.remove()
        })

        // удаление клиента
        btnDeletClient.addEventListener('click', async () => {
          await api.serverDeletClient(client.id)
          table.innerHTML = '';
          modalWindowChange.remove()
          dom.renderTableHeader(columns, table);
          dom.renderRowClient(await api.serverClientsList(), table, columns);
        })

      })

    }
  }]


dom.renderTableHeader(columns, table);
dom.renderRowClient(await api.serverClientsList(), table, columns, sorts);


// создаем окно добавления клиента
const addClient = document.querySelector('.crm__btn');
addClient.addEventListener('click', () => {
  renderModalWindowNewClient()
})


function renderModalWindowNewClient() {
  const modalWindowAdd = document.createElement('div');
  modalWindowAdd.classList.add('modal__add');
  dom.modalClose(modalWindowAdd)

  const wrap = document.createElement('div');
  wrap.classList.add("modal__wrap");

  const containerModalWindowAdd = document.createElement('div');
  containerModalWindowAdd.classList.add('window');

  const windowHeader = document.createElement('div');
  windowHeader.classList.add('window__header');

  const windowTitle = document.createElement('h2');
  windowTitle.classList.add('window__title');
  windowTitle.textContent = 'Новый клиент';

  const windowBtn = document.createElement('button');
  windowBtn.classList.add('window__btn');
  let svgButtonCloseModal = `<svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
  <use xlink:href="img/sprite.svg#window_cancel"></use>
</svg>`
  windowBtn.insertAdjacentHTML("afterbegin", svgButtonCloseModal);
  dom.modalCloseByClickBtn(modalWindowAdd, windowBtn)

  const formAdd = document.createElement('form');
  formAdd.classList.add('window__form');
  formAdd.setAttribute('id', 'form__add');

  const formInputs = document.createElement('div');
  formInputs.classList.add('form__inputs');

  const formInputSurname = document.createElement('input');
  formInputSurname.setAttribute('type', 'text');
  formInputSurname.setAttribute('placeholder', 'Фамилия');
  formInputSurname.classList.add('form__input');
  formInputSurname.name = 'surname';

  const formInputName = document.createElement('input');
  formInputName.type = 'text';
  formInputName.placeholder = 'Имя';
  formInputName.classList.add('form__input');
  formInputName.name = 'name';

  const formInputLastname = document.createElement('input');
  formInputLastname.type = 'text';
  formInputLastname.placeholder = 'Отчество';
  formInputLastname.classList.add('form__input');
  formInputLastname.name = 'lastName';

  const formCase = document.createElement('div');
  formCase.classList.add('form__case');

  const btnAddContact = document.createElement('button');
  btnAddContact.classList.add('form__btn-contact');
  btnAddContact.textContent = 'Добавить контакт';
  let svgBtnAddContact = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <use xlink:href="img/sprite.svg#add_contact"></use>
</svg>`
  btnAddContact.insertAdjacentHTML("afterbegin", svgBtnAddContact);

  const btnSave = document.createElement('button');
  btnSave.classList.add('form__btn');
  btnSave.textContent = 'Сохранить';
  btnSave.setAttribute('form', 'form__add');

  const btnCancel = document.createElement('button');
  btnCancel.classList.add('form__btn-cancel');
  btnCancel.textContent = 'Отменить';
  dom.modalCloseByClickBtn(modalWindowAdd, btnCancel)

  formCase.append(btnAddContact);
  formInputs.append(formInputSurname);
  formInputs.append(formInputName);
  formInputs.append(formInputLastname);
  formAdd.prepend(formInputs);
  formAdd.append(formCase);
  windowHeader.prepend(windowTitle);
  windowHeader.append(windowBtn);
  containerModalWindowAdd.prepend(windowHeader);
  containerModalWindowAdd.append(formAdd);
  containerModalWindowAdd.append(btnSave);
  containerModalWindowAdd.append(btnCancel);
  wrap.append(containerModalWindowAdd)
  modalWindowAdd.append(wrap);
  body.prepend(modalWindowAdd)


  // ренденр select and input
  btnAddContact.addEventListener('click', (e) => {
    e.preventDefault()
    let [selectContactNew, inputContactNew, containerContactsNew] = dom.caseContact(optionsValue, formCase);
    let contact = [selectContactNew, inputContactNew]
    arrayContactsClient.push(contact);
    console.log(arrayContactsClient)
    let indexContact = arrayContactsClient.length - 1;
    contact.index = indexContact;

    inputContactNew.addEventListener('focus', () => {
      const btnDeletContact = document.createElement('button');
      btnDeletContact.classList.add('select__btn');
      let svgBtnDeletContact = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <use xlink:href="img/sprite.svg#cancel__contact"></use>
    </svg>`
      btnDeletContact.insertAdjacentHTML("afterbegin", svgBtnDeletContact);

      // удаление контакт
      btnDeletContact.addEventListener('click', (e) => {
        arrayContactsClient.splice(indexContact, 1)
        e.preventDefault()
        containerContactsNew.remove()
        console.log(arrayContactsClient)
      })
      containerContactsNew.append(btnDeletContact);
    }, { once: true })
    if (arrayContactsClient.length >= 10) {
      btnAddContact.style.display = "none";
    };
  })
  // обрабочтик кнопки создать клиента
  formAdd.addEventListener('submit', async function (e) {
    e.preventDefault
    // достаем данные из формы
    const formData = new FormData(formAdd);
    const newClient = Object.fromEntries(formData);
    //формируем объект с новым клиентом
    newClient.contacts = arrayContactsClient.map(([select, input]) => ({ type: select.value, value: input.value }));
    api.addClientServer(newClient)

    //  рендерим таблицу с клиентом
    table.innerHTML = '';
    dom.renderTableHeader(columns, table);
    dom.renderRowClient(await api.serverClientsList(), table, columns, sorts);
    modalWindowAdd.remove()
  })
}

































