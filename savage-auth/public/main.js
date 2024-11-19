// PbgK6RkY3r775BNP
// mongodb+srv://christianbradford99:PbgK6RkY3r775BNP@cluster0.tgvj0.mongodb.net/


// var crossOutIcons = document.getElementsByClassName("fa fa-heart");
var saveGoals = document.querySelectorAll("div button");
var trash = document.getElementsByClassName("delete");
var heart = document.getElementsByClassName("heartbutton");

console.log(saveGoals)
Array.from(saveGoals).forEach(function (element) {
  element.addEventListener("click", function (e) {
    // e.preventDefault();
    
    const day = this.parentNode.parentNode.childNodes[1].childNodes[1].innerText
    const goal = this.parentNode.parentNode.childNodes[1].childNodes[5].value
    console.log('buttonworking')
    fetch("goals",
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal: goal,
          day: day
          
      
        })
      })
        .then((response) => {
          if (response.ok) return response.json();
        })
        .then((data) => {
          console.log(data);
          window.location.href = "/profile";
        });
  });
});

Array.from(trash).forEach(function(element) {
  element.addEventListener('click', function() {
    console.log('delete:', this.id)
    fetch('goals', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: this.id
    
      })
    }).then(function(response) {
      if (response.ok) return response.json();
      window.location.href = "/profile";
    }).catch(err => console.error(err));
  });
});


Array.from(heart).forEach(function(element){
element.addEventListener('click', function() {
    console.log('crossouticon',this)
    fetch('goals', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        id: this.id
        
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.href = "/profile";

    })
})
});

