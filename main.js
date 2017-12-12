let xml = new XMLHttpRequest(),
  allUsersView = document.getElementById('allUsersView'),
  oneUser = document.getElementById('oneUser'),

  mainTbody = document.getElementsByTagName('tbody')[0],
  mainTbodyText = '',
  allBestFriends = '',
  allfriendsFriendsTxt = '',
  allSuggestedFriends = '',
  data,
  userAge,
  bestFriendsArr,
  bFIndex,
  bFIndexArr = [],
  fFIndex,
  fFIndexArr = [],
  sFIndex,
  uniqallfriendsFriendsIdArr = [],
  allfriendsFriendsIdArr = [],
  allSggFriendsIdDbl = [],
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
<button id="oneUserBtn" class="btn btn-primary btn-lg" type="button" name="button">Return to main page</button>
`;
  let oneUserBtn = document.getElementById('oneUserBtn');

  oneUserBtn.addEventListener('click', function() {
    allUsersView.style.display = "block";
    oneUser.style.display = "none";
    bFIndexArr = []; //data index of bestFriends, clear
    uniqallfriendsFriendsIdArr = [];
    fFIndexArr = [];
  });

};

function bestFriends() {
  bestFriendsArr = data[dataPlace].friends; //array data.friends[id:]
  allBestFriends = '<ol>';
  for (let i = 0; i < bestFriendsArr.length; i++) {
    bFIndex = data.findIndex(d => d.id == bestFriendsArr[i]); //data index of bestFriends
    bFIndexArr.push(bFIndex);
    allBestFriends += '<li>' + data[bFIndex].firstName + ' ' + data[bFIndex].surname + '</li>';
  };
  allBestFriends += '</ol>';
  return allBestFriends;
};

function friendsFriends() {
  let allFfIdString = ''; //string id-jeva prijatelja prijatelja
  console.log("Index best Friend", bFIndexArr); // array of bestFriends index [1, 3, 4, 6]
  for (let i = 0; i < bFIndexArr.length; i++) {
    allFfIdString += data[bFIndexArr[i]].friends + ',';
  };
  allfriendsFriendsIdArr = allFfIdString.split(','); //Array id-jeva prijatelja prijatelja, za koje trebanaci index i da se ne ponavljaju
  let emptyAfF = allfriendsFriendsIdArr.indexOf("");
  allfriendsFriendsIdArr.splice(emptyAfF, 1); // uklanjanje praznog elementa

  for (let i = 0; i < allfriendsFriendsIdArr.length; i++) { // prebacivanje u integer
    allfriendsFriendsIdArr[i] = parseInt(allfriendsFriendsIdArr[i], 10);
  };
  // console.log('Arr id prijatelja prijatelja sa duplikatima', allfriendsFriendsIdArr);
  // uklanjanje duplikata id-jeva prijatelja prijatelja
  for (let i = 0; i < allfriendsFriendsIdArr.length; i++) {
    if (uniqallfriendsFriendsIdArr.indexOf(allfriendsFriendsIdArr[i]) == -1) {
      uniqallfriendsFriendsIdArr.push(allfriendsFriendsIdArr[i]);
    };
  };
  console.log("id-evi prijatelji prijatelja", uniqallfriendsFriendsIdArr);

  allfriendsFriendsTxt = '<ol>'
  for (let i = 0; i < uniqallfriendsFriendsIdArr.length; i++) {
    fFIndex = data.findIndex(d => d.id == uniqallfriendsFriendsIdArr[i]); //data index of friendsFriends
    fFIndexArr.push(fFIndex);
    allfriendsFriendsTxt += '<li>' + data[fFIndex].firstName + ' ' + data[fFIndex].surname + '</li>';
  };
  allfriendsFriendsTxt += '</ol>';
  return allfriendsFriendsTxt;
};




function suggestedFriends() {
  console.log(dataPlace);
  console.log(dataPlace + 1);
  // console.log("indexi prijatelji prijatelja", fFIndexArr);
  console.log('Arr id prijatelja prijatelja sa duplikatima', allfriendsFriendsIdArr);

  function removeMainUser(id) {
    return id != dataPlace + 1;
  }
  let noUserfFIdArr = allfriendsFriendsIdArr.filter(removeMainUser) //bez id-a usera - indexi prijatelji prijatelja
  console.log('bez id-a usera - id prijatelji prijatelja', noUserfFIdArr);
  noUserfFIdArr.sort()
  console.log('sorted', noUserfFIdArr);
  for (let i = 0; i < noUserfFIdArr.length - 1; i++) {
    if (noUserfFIdArr[i + 1] == noUserfFIdArr[i]) {
      console.log(noUserfFIdArr[i + 1]);
    }
  }

  for (let i = 0; i < noUserfFIdArr.length - 1; i++) { //brisu seonikoji nisu dupli- mora da ima bar 2 prijatelja
    if (noUserfFIdArr[i + 1] == noUserfFIdArr[i]) {
      allSggFriendsIdDbl.push(noUserfFIdArr[i + 1]);
    }
  }
  console.log(allSggFriendsIdDbl);

  function unique(el) {
    for (let i = 0; i < allSggFriendsIdDbl.length - 1; i++) { // brisu se dupli id-evi predloga prijatelja
      if (allSggFriendsIdDbl[i + 1] == allSggFriendsIdDbl[i]) {
        allSggFriendsIdDbl.splice(i, 1);
      }
    }
    return el;
  }
  allSggFriendsIdDbl.filter(unique);
  console.log(allSggFriendsIdDbl);
  allSuggestedFriends = `<ol>`
  for (let i = 0; i < allSggFriendsIdDbl.length; i++) {
    sFIndex = data.findIndex(el => el.id == allSggFriendsIdDbl[i])
    console.log(sFIndex);
    allSuggestedFriends += '<li>' + data[sFIndex].firstName + ' ' + data[sFIndex].surname + '</li>';
  }
  allSuggestedFriends += `</ol>`
  return allSuggestedFriends
}