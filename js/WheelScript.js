const WHEEL_RADIUS = 390;
const TEXT_FONT_SIZE = 50;

// Create new wheel object specifying the parameters at creation time.
let theWheel = new Winwheel({
  numSegments: 3, // Specify number of segments.
  outerRadius: WHEEL_RADIUS, // Set outer radius so wheel fits inside the background.
  textFontSize: TEXT_FONT_SIZE, // Set font size as desired.
  // Define segments including colour and text.
  segments: [
    {
      fillStyle: "#eae56f",
      text: "Lagu 1",
      id: Math.floor(Math.random() * Date.now()),
    },
    {
      fillStyle: "#89f26e",
      text: "Lagu 2",
      id: Math.floor(Math.random() * Date.now()),
    },
    {
      fillStyle: "#c100be",
      text: "Lagu 3",
      id: Math.floor(Math.random() * Date.now()),
    },
  ],
  // Specify the animation to use.
  animation: {
    type: "spinToStop",
    duration: 5,
    spins: 8,
    callbackFinished: alertPrize,
  },
});
let hasilSpin = [];


// -------------------------------------------------------
// Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters
// note the indicated segment is passed in as a parmeter as 99% of the time you will want to know this to inform the user of their prize.
// -------------------------------------------------------
function alertPrize(indicatedSegment) {
  // Do basic alert of the segment text.
  // You would probably want to do something more interesting with this information.
  // alert("The winner is: " + indicatedSegment.text);
  Swal.fire({
    icon: "success",
    iconHtml: "✨",
    title: indicatedSegment.text,
  });
  hasilSpin.push(indicatedSegment.text);

  let listOk = "";
  for (let i = 0; i < hasilSpin.length; i++) {
    listOk += hasilSpin[i] + "<br><br>";
  }
  document.getElementById("js-laguterpilih").innerHTML = listOk;
  console.log(hasilSpin);
  resetWheel();
}

// =======================================================================================================================
// Code below for the power controls etc which is entirely optional. You can spin the wheel simply by
// calling theWheel.startAnimation();
// =======================================================================================================================
let wheelPower = 2;
let wheelSpinning = false;

// -------------------------------------------------------
// Click handler for spin button.
// -------------------------------------------------------
function startSpin() {
  // Ensure that spinning can't be clicked again while already running.
  if (wheelSpinning == false) {
    // Begin the spin animation by calling startAnimation on the wheel object.
    theWheel.startAnimation();

    // Set to true so that power can't be changed and spin button re-enabled during
    // the current animation. The user will have to reset before spinning again.
    wheelSpinning = true;
  }
}

// -------------------------------------------------------
// Function for reset button.
// -------------------------------------------------------
function resetWheel() {
  theWheel.stopAnimation(false); // Stop the animation, false as param so does not call callback function.
  theWheel.rotationAngle = 0; // Re-set the wheel angle to 0 degrees.
  theWheel.draw(); // Call draw to render changes to the wheel.
  wheelSpinning = false; // Reset to false to power buttons and spin can be clicked again.
}

// -------------------------------------------------------
// Name functionality.
// -------------------------------------------------------

let nameList = theWheel.segments.filter((segment) => segment != null);
console.log(nameList);
// -------------------------------------------------------
// Function for render the list of names.
// -------------------------------------------------------
function renderNames(todo) {
  localStorage.setItem("nameList", JSON.stringify(nameList));

  const list = document.querySelector(".js-name-list");
  const item = document.querySelector(`[data-key='${todo.id}']`);

  if (todo.deleted) {
    item.remove();
    if (nameList.length === 0) list.innerHTML = "";
    return;
  }

  const isChecked = todo.checked ? "done" : "";
  const node = document.createElement("li");
  node.setAttribute("class", `todo-item ${isChecked}`);
  node.setAttribute("data-key", todo.id);
  node.innerHTML = `
    <span><b>${todo.text}</b></span>
    <button type="button" class="btn btn-danger btn-sm js-delete-todo" >❌</button>
    `;

  if (item) {
    list.replaceChild(node, item);
  } else {
    list.append(node);
  }
}

// -------------------------------------------------------
// Function for re-render the wheel after changes.
// -------------------------------------------------------
function renderWheel() {
  theWheel = new Winwheel({
    numSegments: nameList.length, // Specify number of segments.
    outerRadius: WHEEL_RADIUS, // Set outer radius so wheel fits inside the background.
    textFontSize: TEXT_FONT_SIZE, // Set font size as desired.
    segments: nameList,
    // Specify the animation to use.
    animation: {
      type: "spinToStop",
      duration: 5,
      spins: 8,
      callbackFinished: alertPrize,
    },
  });
}

// -------------------------------------------------------
// Function to add a name.
// -------------------------------------------------------
function addName(text) {
  const name = {
    text,
    id: Math.floor(Math.random() * 100),
    fillStyle: "#" + Math.floor(Math.random() * 16777214).toString(16),
  };

  nameList.push(name);
  renderWheel();
  renderNames(name);
}

// -------------------------------------------------------
// Function to delete a name.
// -------------------------------------------------------
function deleteName(key) {
  const index = nameList.findIndex((item) => item.id === Number(key));
  const name = {
    deleted: true,
    ...nameList[index],
  };
  nameList = nameList.filter((item) => item.id !== Number(key));
  renderNames(name);
  renderWheel();
}

// -------------------------------------------------------
// Event listener for submiting a name from the input.
// -------------------------------------------------------
const form = document.querySelector(".js-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector(".js-name-input");

  const text = input.value.trim();
  if (text !== "") {
    addName(text);
    input.value = "";
    input.focus();
  }
});

// Tampilkan Lagu terpilih

// -------------------------------------------------------
// Event listener for deleting a name from the list.
// -------------------------------------------------------
const list = document.querySelector(".js-name-list");
list.addEventListener("click", (event) => {
  console.log(event.target.classList);
  if (event.target.classList.contains("js-delete-todo")) {
    const itemKey = event.target.parentElement.dataset.key;
    deleteName(itemKey);
  }
});

// -------------------------------------------------------
// Event listener for the page to load.
// -------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  localStorage.setItem("nameList", JSON.stringify(nameList));
  const ref = localStorage.getItem("nameList");
  if (ref) {
    nameList = JSON.parse(ref);
    nameList.forEach((t) => {
      renderNames(t);
    });
  }
});

// -------------------------------------------------------
// Event listener for opening and closing the collapsible list.
// -------------------------------------------------------
var coll = document.getElementsByClassName("collapsible-button");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}
