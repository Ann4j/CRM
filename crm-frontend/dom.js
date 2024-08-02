
function modalClose(modal) {
  // закрытие модального окна создания нового клиента по клику на фон
  modal.addEventListener('click', ({ currentTarget, target }) => {
    const modal = currentTarget
    const isClickedOnBackDrop = target === modal
    if (isClickedOnBackDrop) {
      modal.remove()
    }
  })
}

function modalCloseByClickBtn(modal, btn) {
  btn.addEventListener('click', () => {
    modal.remove()
  })

}


// рендер шапки таблицы
function renderTableHeader(columns, table) {
  for (const column of columns) {
    let tableHeaderCell = document.createElement('div');
    tableHeaderCell.classList.add('table__row');
    let tableHeaderDescr = document.createElement('p');
    tableHeaderDescr.textContent = column.name;
    tableHeaderDescr.classList.add('table__descr')
    let svgHeader
    if (tableHeaderDescr.textContent === 'ID') {
      svgHeader = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <use xlink:href="img/sprite.svg#arrow_ID"></use>
    </svg>`
    } else if (tableHeaderDescr.textContent === 'Фамилия Имя Отчество') {
      tableHeaderDescr.classList.add('table__descr-name');
      svgHeader = `<svg width="29" height="14" viewBox="0 0 29 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <use xlink:href="img/sprite.svg#arrow_sort"></use>
    </svg>`
    } else if (tableHeaderDescr.textContent === 'Дата и время создания' || tableHeaderDescr.textContent === 'Последние изменения') {
      tableHeaderDescr.classList.add('table__descr-date');
      svgHeader = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <use xlink:href="img/sprite.svg#arrow_date"></use>
    </svg>`
    } else {
      svgHeader = ''
    }

    if (column.sort) {
      tableHeaderCell.addEventListener('click', () => column.sort(column.key));
    }
    tableHeaderDescr.insertAdjacentHTML('beforeend', svgHeader);
    tableHeaderCell.append(tableHeaderDescr);
    table.append(tableHeaderCell)

  }
}


// добавление блок с select и input
function caseContact(optionsValue, formCase) {
  const containerContacts = document.createElement('div');
  containerContacts.classList.add('form__contact')
  const selectContacts = document.createElement('select');
  selectContacts.classList.add('select')
  for (const options of optionsValue) {
    const selectOption = document.createElement('option');
    selectOption.innerHTML = options
    selectOption.value = options
    selectContacts.append(selectOption)
  }

  const inputContact = document.createElement('input');
  inputContact.classList.add('select__input')
  inputContact.setAttribute('placeholder', 'Введите данные контакта');
  if (window.matchMedia('(max-width: 420px)')) {
    inputContact.placeholder = 'Введите данные'
  }

  containerContacts.append(selectContacts);
  containerContacts.append(inputContact);
  formCase.prepend(containerContacts)

  return [selectContacts, inputContact, containerContacts]
}


// функция рендаринга таблицы с клиентом

function sortString(a, b) {
  if (a > b) return 1; // если первое значение больше второго
  if (a == b) return 0; // если равны
  if (a < b) return -1; // если первое значение меньше второго
}

function renderRowClient(clientList, table, columns, sorts) {
  for (const sort in sorts) {
    clientList.sort((a, b) => sorts[sort] === 'asc' ? sortString(a[sort], b[sort]) : sortString(b[sort], a[sort]));
  }
  for (const client of clientList) {
    for (let column of columns) {
      let cellClient = document.createElement('div');
      cellClient.classList.add('table__cell');
      column.format(client, cellClient);
      table.append(cellClient);
    }
  }
}


// рендер модельного окна удаления
function renderModalWindiwDeletClient(body) {
  const modalWindowDelet = document.createElement('div');
  modalWindowDelet.classList.add('modal__delet');
  modalClose(modalWindowDelet)

  const wrap = document.createElement('div');
  wrap.classList.add("modal__wrap");

  const containerModalWindowDelet = document.createElement('div');
  containerModalWindowDelet.classList.add('window');

  const windowHeader = document.createElement('div');
  windowHeader.classList.add('window__header', 'window__header-delet');

  const windowTitle = document.createElement('h2');
  windowTitle.classList.add('window__title', 'window__title-delet');
  windowTitle.textContent = 'Удалить клиента';

  const windowBtnClose = document.createElement('button');
  windowBtnClose.classList.add('window__btn');
  let svgButtonCloseModal = `<svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
  <use xlink:href="img/sprite.svg#window_cancel"></use>
</svg>`
  windowBtnClose.insertAdjacentHTML("afterbegin", svgButtonCloseModal);
  modalCloseByClickBtn(modalWindowDelet, windowBtnClose)

  const descrDelet = document.createElement('p');
  descrDelet.classList.add('window__descr');
  descrDelet.textContent = 'Вы действительно хотите удалить данного клиента?';

  const btnDeletClient = document.createElement('button');
  btnDeletClient.classList.add('form__btn')
  btnDeletClient.textContent = 'Удалить'

  const btnCansel = document.createElement('button');
  btnCansel.classList.add('form__btn-cancel');
  btnCansel.textContent = 'Отмена';
  modalCloseByClickBtn(modalWindowDelet, btnCansel);

  windowHeader.append(windowTitle);
  windowHeader.append(windowBtnClose);
  containerModalWindowDelet.append(windowHeader);
  containerModalWindowDelet.append(descrDelet);
  containerModalWindowDelet.append(btnDeletClient);
  containerModalWindowDelet.append(btnCansel);
  wrap.append(containerModalWindowDelet)
  modalWindowDelet.append(wrap)
  body.prepend(modalWindowDelet)


  return [btnDeletClient, modalWindowDelet]
}

const dom = { renderTableHeader, caseContact, renderRowClient, renderModalWindiwDeletClient, modalClose, modalCloseByClickBtn };

export default dom;

