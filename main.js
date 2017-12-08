let xml = new XMLHttpRequest(),
  allUsersView = document.getElementById('allUsersView'),
  oneUser = document.getElementById('oneUser'),
  oneUserBtn = document.getElementById('oneUserBtn'),
  mainTbody = document.getElementsByTagName('tbody')[0],
  mainTbodyText = '',
  allBestFriends = '',
  data,
  userAge,
  bestFriendsArr,
  bFIndex,
  bFIndexArr = [],
  dataPlace;

xml.open('GET', 'https://raw.githubusercontent.com/SanjaAra/FriendsBook_data_json/master/data.json');
xml.addEventListener('readystatechange', function() {
  if (xml.readyState == 4 && xml.status == 200) {
    createallUsersView();
  }
});
xml.send();

function createallUsersView() {
  data = JSON.parse(xml.responseText);
  console.log(data);
  for (let i = 0; i < data.length; i++) {
    mainTbodyText += `
    <tr>
      <td>${data[i].firstName} ${data[i].surname}</td>
      <td><button class="btn btn-warning" type="button" name="button" data-place=${i}>User Info</button></td>
    </tr>
    `
  }
  mainTbody.innerHTML = mainTbodyText;
  let btnsInfo = document.querySelectorAll('button[data-place]');
  for (let i = 0; i < btnsInfo.length; i++) {
    btnsInfo[i].addEventListener('click', moreInfo)
  }
};

function moreInfo() {
  dataPlace = parseInt(this.getAttribute('data-place'));
  allUsersView.style.display = "none";
  oneUser.style.display = "block";
  createOneUser();
}

// second page

oneUserBtn.addEventListener('click', function() {
  allUsersView.style.display = "block";
  oneUser.style.display = "none";
})

function createOneUser() {
  let num1 = data[dataPlace].age;
  if (typeof num1 == 'number') {
    userAge = data[dataPlace].age;
  } else {
    userAge = '';
  }
  oneUser.innerHTML = `
<h2>${data[dataPlace].firstName} ${data[dataPlace].surname}</h2>
<p>My age: <span>${userAge}</span></p>
<p>Gender: <span>${data[dataPlace].gender}</span></p>
<p>My best friends: <span>${bestFriends()}</span></p>
<p>Friends of my friends: <span>${friendsFriends()}</span></p>
<p>Suggested friends: <span>${suggestedFriends()}</span></p>
`;
}

function bestFriends() {
  bestFriendsArr = data[dataPlace].friends //data.friends[id:]
  allBestFriends = '<ol>'
  for (let i = 0; i < bestFriendsArr.length; i++) {
    bFIndex = data.findIndex(d => d.id == bestFriendsArr[i]); //data index of bestFriends
    bFIndexArr.push(bFIndex);
    allBestFriends += '<li>' + data[bFIndex].firstName + ' ' + data[bFIndex].surname + '</li>';
  };
  allBestFriends += '</ol>'
  return allBestFriends
};

function friendsFriends() {
  allFriendsFriends = 'u izradi :)'
  console.log(bFIndexArr); // array of bestFriends index
  return allFriendsFriends
}

function suggestedFriends() {
  allsggFriends = 'u izradi :)'
  return allsggFriends
}