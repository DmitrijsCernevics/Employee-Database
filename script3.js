// A template function to create the list item HTML
function createUserHTML(user) {
   return `
   <li id="${user.id}">
     <fieldset disabled>
       <label><input type="text" name="name" value="${user.name}" maxlength="30" >
       </label>
       <label><input type="text" name="surname" value="${user.surname}" maxlength="30">
     </label>
       <label><input type="number" name="age" value="${user.age}" pattern="/^-?\d+\.?\d*$/" onKeyPress="if(this.value.length==3) return false">
       </label>
     </fieldset>
     <button class="remove" onClick="removeuser('${user.id}')"></button><button class="edit" onClick="edituser(this)"></button>
   </li>
   `
}

function uniqueId() {
   return Math.random().toString(16).slice(2);
}

// A factory function to create a new user object
function createuser(name, surname, age) {
   return {
      id: uniqueId(),
      name: name,
      surname: surname,
      age: age,
   };
}

// a function to update the storage
// and update the displayed list
function updateuserList(userList) {
   localStorage.setItem('user-list', JSON.stringify(userList));
   displayusers(userList);
}

// as we have edituser and removeuser it makes
// sense to have adduser
function adduser(name, surname, age) {
   const newuser = createuser(name, surname, age);

   userList.push(newuser);
   updateuserList(userList);
}

function removeuser(id) {
   userList = userList.filter(
      function (user) {
         return user.id !== id;
      }
   )

   updateuserList(userList);
}

function edituser(editButton) {
   const listItem = editButton.parentElement;
   const fieldset = listItem.querySelector('fieldset');
   const editing = editButton.textContent === '';

   // fieldsets have an elements array that allow
   // you to access the inputs by input name
   const name = fieldset.elements.name;
   const surname = fieldset.elements.surname;
   const age = fieldset.elements.age;

   if (editing) {
      editButton.textContent = ' ';
      editButton.classList.remove("edit");
      editButton.classList.add("save");
      fieldset.disabled = false; // now we can edit the inputs
      name.focus(); // move cursor to name
      return; // exit here
   }

   // otherwise the button clicked is 'SAVE'
   if (!name.value || !age.value || !surname.value) {
      alert('Save is impossible! Empty fields are not allowed!')
      return
   }
   editButton.textContent = '';
   fieldset.disabled = true;

   // Iterate through the users
   userList = userList.map(function (user) {
      // if the user id matches the list item id then ammend
      if (user.id === listItem.id) {
         user.name = name.value;
         user.surname = surname.value;
         user.age = age.value;
      }

      return user;
   })

   updateuserList(userList);
}

function displayusers(userList = []) {
   const users = document.querySelector('.users');
   const ages = userList.map(createUserHTML);

   users.innerHTML = ages.join('\n');
}

// A generic function to reset fields
// Using the rest operator e.g ...fields 
// to convert all arguments to an array
// e.g. resetFields(name, age) → [name, age]
function resetFields(...fields) {
   fields.forEach(function (field) {
      field.value = "";
   })
}

// Moved addButton here. Saves having to scroll to the top of the code
// to find out what addButton is
const addButton = document.querySelector('.add');

addButton.addEventListener('click', function (event) {
   // event.target is the button, parent is the wrapping div
   const parent = event.target.parentElement;
   // parent can be used as the root to search from
   const age = parent.querySelector('.age');
   const name = parent.querySelector('.name');
   const surname = parent.querySelector('.surname');

   if (!name.value || !age.value || !surname.value) {
      alert('Please fill all the fields!')
      RETURN
   }

   adduser(name.value, surname.value, age.value);
   resetFields(name, surname, age);
});

let userList = [];

if (localStorage.getItem('user-list')) {
   userList = JSON.parse(localStorage.getItem('user-list'));
   displayusers(userList);
}

 // localStorage.removeItem('user-list')