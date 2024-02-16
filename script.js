const canvas = document.querySelector("canvas") // link do canvas do html com o js
const context = canvas.getContext("2d") // link do contexto do canvas
const score = document.querySelector(".score--value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")

const audio = new Audio("assets/audio.mp3")
const initialPosition = {x: 300, y: 300}
const size = 30
// é importante variar as posicoes der 30 em 30 pois a cobra tem o tamanho 30

const incrementScore = () => {
    score.innerText = +score.innerText + 10
}

let snake = [initialPosition]

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30 //tranformando o numero em um multiplo de 30
}
const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: "red"
}

let direction = ""
let loopId

const drawFood = () => {
    context.fillStyle = food.color
    context.fillRect(food.x, food.y, size, size)
}

const drawSnake = () => {
    context.fillStyle = "green"

    snake.forEach((position, index) => { //percorrer o array snake por cada elemenmto
        if(index == snake.length - 1) {
            context.fillStyle = "lightGreen"
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

const checkEat = () => {
    const head = snake[snake.length - 1]

    if(head.x == food.x && head.y == food.y) {
        incrementScore()
        snake.push(head)
        audio.play()

        let x = randomPosition()
        let y = randomPosition()

        //garantir que gere comidas fora da cobrinha
        while(snake.find((position) => position.x == x && position.y == y)){
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
    }
}

const checkColision = () => {
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length - 2 // pegar a primeira posicao que nao é a cabeca

    const wallColision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y 
    })

    if(wallColision || selfCollision){
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined

    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(2px)"
}

const gameLoop = () => {
    clearInterval(loopId) //limpar o setTimeout antes de usar novamente
    context.clearRect(0, 0, 600, 600)
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    checkEat()
    checkColision()

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

buttonPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [initialPosition]

    food.x = randomPosition()
    food.y = randomPosition()
})
