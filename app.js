//$(document).ready(function() {
//validate();
//});

function validate() {
  $("#entries, #donator").keyup(function() {
    if ($(this).val() == "") {
      $(".enable").prop("disabled", true);
    } else {
      $(".enable").prop("disabled", false);
    }
  });
}

let raffleArray = [];

const randomize = array => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const randomizeProgress = () => {
  let currentProgress = 0;
  const interval = setInterval(function() {
    currentProgress += getRandomInt(20, 50);
    $("#dynamic")
      .css("width", currentProgress + "%")
      .attr("aria-valuenow", currentProgress)
      .text(`I'm working on it`)
      .addClass("progress-bar-animated");
    if (currentProgress >= 100) {
      clearInterval(interval);
      $("#dynamic")
        .text(`Entries Randomized`)
        .removeClass("progress-bar-animated");
    }
  }, 1000);
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const handleEntry = (name, entries) => {
  const newName = `${name},`;
  const repeatedName = newName.repeat(entries);
  const slicedName = repeatedName.slice(0, -1);
  const fullEntry = slicedName.split(",");
  raffleArray.push(fullEntry);
  $("#donator, #entries").val("");
};

const handleOdds = () => {
  const flatArray = raffleArray.reduce((a, b) => a.concat(b), []);
  const randomizedArray = randomize(flatArray);
  const entrantTotal = randomizedArray.reduce(function(obj, item) {
    obj[item] = (obj[item] || 0) + 1;
    return obj;
  }, {});
  let entryValues = Object.values(entrantTotal);
  entryValues.forEach(entry => {
    const raffleOdds = ((entry / flatArray.length) * 100).toFixed(2);
    if (raffleOdds > 50) {
      $("#chance")
        .append(
          `<div class="percentage m-1 ${className(
            "green"
          )}">${raffleOdds}%</div><hr>`
        )
        .addClass(`border-left border-right border-light`);
    } else if (raffleOdds < 10) {
      $("#chance")
        .append(
          `<div class="percentage m-1 ${className(
            "red"
          )}">${raffleOdds}%</div><hr>`
        )
        .addClass(`border-left border-right border-light`);
    } else {
      $("#chance")
        .append(
          `<div class="percentage m-1 ${className(
            "white"
          )}">${raffleOdds}%</div><hr>`
        )
        .addClass(`border-left border-right border-light`);
    }
  });
  return {
    entrantTotal,
    flatArray
  };
};

const handleCount = (entrantTotal, flatArray) => {
  $("#count").empty();
  const entryCount = JSON.stringify(entrantTotal);
  // returns a stringified object from the handleOdds function.
  // the keys are the names and the values are the count. ex. {"josh":5}
  const formattedEntryCount = entryCount
    .slice(1, -1)
    .replace(/\"/g, " ")
    .replace(/ :/g, ": ")
    .split(",");
  // returns an array of the entryCounts as strings formatted like this: [" josh: 5", " kenny: 6"]
  formattedEntryCount.forEach(count => {
    count = count.trim();
    // removes whitespace from beginning of each formattedEntryCount
    let id = count.substring(0, count.indexOf(":"));
    // returns the name as a string like "josh" by trimming the colon and anything after it.
    // used to match id of count to delete button and filter the array accordingly.
    if (flatArray.length > 0) {
      $("#count")
        .append(
          `<span id="${id}" class="delete-entry m-1 ml-3 float-left btn btn-sm btn-outline-light" value="${id}">X</span><div class="names m-1 ${className(
            "white"
          )}">${count}</div><hr>`
        )
        .addClass(`border-left border-right border-light`);
    }
  });

  $("#total-entries").html(
    `<div class="${className("blue")}">Total Entries: ${flatArray.length}</div>`
  );
  $("#pick-winner").prop("disabled", false);
  $(".alert").alert("close");
};

const doSubmit = () => {
  const name = $("#donator")
    .val()
    .trim();
  const entries = $("#entries")
    .val()
    .trim();
  if (entries > 0 && entries != "" && name != "") {
    $("#chance").empty();
    randomizeProgress();
    handleEntry(name, entries);
    const { entrantTotal, flatArray } = handleOdds();
    handleCount(entrantTotal, flatArray);
  } else {
    handleErrors();
  }
};

const handleErrors = () => {
  $("#entries, #donator").val("");
  let alertDiv = $("<div>");
  alertDiv
    .addClass("mt-2 alert alert-danger")
    .attr("role", "alert")
    .attr("data-dismiss", "alert")
    .text(`Oops. It's just grease. Click to dismiss.`);
  $(".form-group").append(alertDiv);
};
const className = color => {
  let classes = "badge badge-";
  classes +=
    color == "green"
      ? "success"
      : color == "red"
      ? "danger"
      : color == "white"
      ? "light"
      : color == "yellow"
      ? "warning"
      : color == "blue"
      ? "primary"
      : "dark";
  return classes;
};

const pickWinner = () => {
  const flatArray = raffleArray.reduce((a, b) => a.concat(b), []);
  const random = randomize(flatArray);
  const winner = random[getRandomInt(0, random.length - 1)];
  randomizeProgress();
  let interval = window.setInterval(() => {
    const tickerRandom = random[getRandomInt(0, random.length - 1)];
    $("#shuffle").html(
      `<div class="${className("green")}">${tickerRandom}</div>`
    );
    window.setTimeout(() => {
      clearInterval(interval);
      $("#shuffle").html(`<div class="${className("green")}">${winner}</div>`);
    }, 6000);
  }, 100);

  window.setTimeout(() => {
    $("#winner").html(
      `<div class="${className("white")}">I'm working on it</div>`
    );
  }, 10);
  window.setTimeout(() => {
    $("#winner").html(
      `<div class="${className("white")}">harnessing wizzard logic&trade;</div>`
    );
  }, 1000);
  window.setTimeout(() => {
    $("#winner").html(`<div class="${className("white")}">I mean</div>`);
  }, 2000);
  window.setTimeout(() => {
    $("#winner").html(`<div class="${className("white")}">To be honest</div>`);
  }, 3000);
  window.setTimeout(() => {
    $("#winner").html(`<div class="${className("white")}">Technically</div>`);
  }, 4000);
  window.setTimeout(() => {
    $("#winner").html(`<div class="${className("white")}">Literally</div>`);
  }, 5000);
  window.setTimeout(() => {
    $("#winner").html(
      `<div class="${className("dark")}">The winner is...</div>`
    );
  }, 5900);
};

$("#submit").on("click", event => {
  event.preventDefault();
  doSubmit();
});

$("#pick-winner").on("click", event => {
  event.preventDefault();
  if (raffleArray.length == 0) {
    $(".error").modal();
  } else {
    pickWinner();
    // scam.play();
    // $(".cancelled").modal();
    // typeWriter();
  }
});

const scam = new Audio(`hahaha.mp3`);

let i = 0;
let str = `RAFFLE IS CANCELLED! `;
let txt = str.repeat(162);
let speed = 62;

function typeWriter() {
  if (i < txt.length) {
    const modalId = $("#typewriter");
    modalId.append(txt.charAt(i));
    i++;
    setTimeout(typeWriter, speed);
  }
}

const resetEntries = () => {
  raffleArray = [];
  flatArray = [];
  $("#total-entries, #count, #chance, #winner").empty();
  $("#shuffle").empty();
  $("#winner").empty();
  $(".progress-bar")
    .css("width", "0%")
    .attr("aria-valuenow", 0)
    .text("");
  $("#pick-winner").prop("disabled", true);
};

$("#clear").on("click", event => {
  event.preventDefault();
  window.location.reload();
  // raffleArray = [];
  // flatArray = [];
  // $("#donation-total, #odds, #chance, #winner, #shuffle").empty();
  // $("#shuffle").empty();
  // $(".progress-bar")
  //   .css("width", "0%")
  //   .attr("aria-valuenow", 0)
  //   .text("");
});

$("#reset").on("click", event => {
  event.preventDefault();
  $(".reset-modal").modal();
  resetEntries();
  localStorage.clear();
});

$(".delete").on("click", event => {
  event.preventDefault();
  const savedRaffle = localStorage.getItem("raffle");
  if (savedRaffle) {
    $(".save-msg").html(`<p><b>Saved data has been deleted.</b></p>`);
    localStorage.clear();
  } else {
    $(".save-msg").html(
      `<p><b>It's fun to click buttons, but there is nothing to delete.</b></p>`
    );
  }
});

$(".save-btn").on("click", event => {
  event.preventDefault();
  $(".save-modal").modal();
  $(".save-msg").empty();
});

$(".load-btn").on("click", event => {
  event.preventDefault();
  $("#no-save").empty();
  $(".refresh").remove();
  $(".load-modal").modal();
});

$(".save").on("click", event => {
  // $(".save-modal").modal("hide")
  event.preventDefault();
  const flatArray = raffleArray.reduce((a, b) => a.concat(b), []);
  if (flatArray.length > 0) {
    localStorage.setItem("raffle", JSON.stringify(flatArray));
    $(".save-msg").html(`<p><b>Success! Raffle has been saved.</b></p>`);
  } else {
    $(".save-msg").html(`<p><b>No entries found. Add entries first.</b></p>`);
  }
});

$(".load-data").on("click", event => {
  event.preventDefault();
  const savedRaffle = localStorage.getItem("raffle");
  if (raffleArray.length === 0 && savedRaffle) {
    let namesList = JSON.parse(savedRaffle);
    raffleArray.push(namesList);
    const { entrantTotal, flatArray } = handleOdds();
    handleCount(entrantTotal, flatArray);
    $(".load-msg").html(
      `<p id="no-save"><b>Saved raffle has been loaded.</b></p>`
    );
  } else if (!savedRaffle) {
    $(".load-msg").html(`<p id="no-save"><b>No save data found.</b></p>`);
  } else if (raffleArray.length !== 0 && savedRaffle) {
    $(".load-msg").html(
      `<p id="no-save"><b>Saved data found. Refresh the page before loading the saved raffle.</b></p>`
    );
    $(".refresh").remove();
    $(".load-footer").append(
      `<button class="btn btn-primary refresh">Refresh Page</button>`
    );
  }
});

$(document).on("click", ".delete-entry", event => {
  $("#count, #chance, #winner", "#shuffle").empty();
  $("#chance").empty();
  $("#winner").empty();
  $("#shuffle").empty();
  const { id, value } = event.target;
  const array = raffleArray.reduce((a, b) => a.concat(b), []);
  const filteredArray = array.filter(name => name !== id);
  raffleArray = filteredArray;
  const { entrantTotal, flatArray } = handleOdds();
  handleCount(entrantTotal, flatArray);
  let spanId = `#${id}`;
  $(spanId).hide();
  $(".progress-bar")
    .css("width", "0%")
    .attr("aria-valuenow", 0)
    .text("");
});

$(document).on("click", ".refresh", event => {
  event.preventDefault();
  window.location.reload();
});

$(document).on("click", "#clear-page", event => {
  event.preventDefault();
  window.location.reload();
});
