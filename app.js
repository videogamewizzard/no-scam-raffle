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
  let total = trimmedName.split(" ")
  console.log(total)
  raffleArray.push(total)
  $("#donator").val("");
  $("#entries").val("");
  const flatArray = raffleArray.flat(1)
  console.log(flatArray)
  let totalEntries = flatArray.reduce(function (obj, item) {
    obj[item] = (obj[item] || 0) + 1;
    return obj
  }, {});
  $("#odds").text(`Entries: ${JSON.stringify(totalEntries)}`)

});

$("#randomize").on("click", (event) => {
  event.preventDefault()
  let flatArray = raffleArray.flat(1)
  const random = randomize(flatArray)
  console.log(random)
  let winner = random[Math.floor(Math.random() * random.length)];
  console.log(winner)
  $('#winner').text(`THE WINNER IS... ${winner}`)
})

//for (let i = 0; i < flatArray.length; i++) {
// console.log(flatArray[i])


$('#pick-winner').on('click', function (event, winner) {
  event.preventDefault()


})