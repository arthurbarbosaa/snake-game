const canvas = document.querySelector("canvas") // link do canvas do html com o js
const context = canvas.getContext("2d") // link do contexto do canvas

const size = 30
// é importante variar as posicoes der 30 em 30 pois a cobra tem o tamanho 30

const snake = [
    {x: 300, y: 300},
    {x: 330, y: 300},
]
const food = {
    x: 30,
    y: 30,
    color: "red"
}

const randomNumber = () => {
    return Math.round(Math.random())
}

let direction = ""
let loopId

const drawFood = () => {
    context.fillStyle = food.color
    context.fillRect(food.x, food.y, size, size)
}

const drawSnake = () => {
    context.fillStyle = "#ddd"

    snake.forEach((position, index) => { //percorrer o array snake por cada elemenmto
        if(index == snake.length - 1) {
            context.fillStyle = "white"
        }

        context.fillRect(position.x, position.y, size, size)
    })
}

const moveSnake = () => {
    if(!direction) return

    const head = snake[snake.length - 1] // pegando a cabeca da cobra(esta na ultima posicao do array)

    
    if(direction == "right") {
        snake.push({ x: head.x + size, y: head.y})
    }
    if(direction == "left") {
        snake.push({ x: head.x - size, y: head.y})
    }
    if(direction == "down") {
        snake.push({ x: head.x, y: head.y + size})
    }
    if(direction == "up") {
        snake.push({ x: head.x, y: head.y - size})
    }

    snake.shift() // removendo a calda
}

const drawGrid = () => {
    context.lineWidth = 1
    context.strokeStyle = "white"

    for(let i = 30; i < canvas.width; i += 30) {
        context.beginPath()
        context.lineTo(i, 0)
        context.lineTo(i, 600)
        context.stroke()

        context.beginPath()
        context.lineTo(0, i)
        context.lineTo(600, i)
        context.stroke()
    }


}

const gameLoop = () => {
    clearInterval(loopId) //limpar o setTimeout antes de usar novamente
    context.clearRect(0, 0, 600, 600)
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()

    // apos 300ms chamar a funcao gameLoop novamente
    setTimeout(() => {
        gameLoop()
    }, 150) // mude aqui para deixar o jogo mais rapido/devagar
}




gameLoop()

document.addEventListener("keydown", ({ key }) => {
    if(key == "ArrowRight" && direction != "left") {
        direction = "right"
    }
    if(key == "ArrowLeft" && direction != "right") {
        direction = "left"
    }
    if(key == "ArrowDown" && direction != "up") {
        direction = "down"
    }
    if(key == "ArrowUp" && direction != "down") {
        direction = "up"
    }
})
