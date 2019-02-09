const raffleArray = []
const flatArray = []

const randomize = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

$("#submit").on("click", event => {
  event.preventDefault();
  let name = $("#donator").val().trim();
  let entries = $("#entries").val().trim()
  let newName = `${name} `
  let repeatedName = newName.repeat(entries)
  let trimmedName = repeatedName.trim()
  let fullEntry = trimmedName.split(" ")
  console.log(fullEntry)
  raffleArray.push(fullEntry)
  $("#donator").val("");
  $("#entries").val("");
  const flatArray = raffleArray.flat(1)
  console.log(flatArray)
  let totalEntries = flatArray.reduce(function (obj, item) {
    obj[item] = (obj[item] || 0) + 1;
    return obj
  }, {});
  $("#odds").text(`Entries: ${JSON.stringify(totalEntries)}`)
  $('#donation-total').text(`Total Entries: ${flatArray.length}`)
});

$("#randomize").on("click", (event) => {
  event.preventDefault()
  randomizeTimer();
})

$('#pick-winner').on('click', event => {
  event.preventDefault()
  let flatArray = raffleArray.flat(1)
  const random = randomize(flatArray)
  console.log(random)
  let winner = random[Math.floor(Math.random() * random.length)];
  console.log(winner)
  $('#winner').text(`THE WINNER IS... ${winner}`)
})

function randomizeTimer() {
  $(function () {
    let current_progress = 0;
    let interval = setInterval(function () {
      current_progress += 20;
      $("#dynamic")
        .css("width", current_progress + "%")
        .attr("aria-valuenow", current_progress)
        .text(current_progress + "% Complete");
      if (current_progress >= 100)
        clearInterval(interval);
    }, 1000);
  });
}