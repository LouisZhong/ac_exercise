const GAME_STATE = {
  FirstCardAwaits: 'FirstCardAwaits',
  SecondCardAwaits: 'SecondCardAwaits',
  CardsMatchFailed: 'CardsMatchFailed',
  CardsMatched: 'CardsMatched',
  GameFinished: 'GameFinished'
}
  
const Symbols = [
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png', // 黑桃
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png', // 愛心
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', // 方塊
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png' // 梅花
]

const view = {
  getCardElement(index) {    
    return `<div data-index='${index}' class="card back"></div>`
  },

  getCardContent(index) {
    const number = this.transformNumber((index % 13) + 1)
    const symbol = Symbols[Math.floor(index / 13)]
    return `
      <p>${number}</p>
      <img src="${symbol}" alt="">
      <p>${number}</p>
      `
  },

  transformNumber(number) {
    switch (number) {
      case 1:
        return 'A'
      case 11:
        return 'J'
      case 12:
        return 'Q'
      case 13: 
        return 'K'
      default:
        return number
    }    
  },

  displayCards(indexes) {
    const rootElement = document.querySelector('#cards')
    rootElement.innerHTML = indexes
      .map(index => this.getCardElement(index))
      .join('')
    // rootElement.innerHTML = Array.from(Array(52).keys()).map(index => this.getCardElement(index)).join('')
    // rootElement.innerHTML = this.getCardElement(13)
  },

  //...cards會把傳進來的陣列變成一個值，接收很多個參數
  //flipCard(card) VS flipCards(...cards)
  //flipCards(1,2,3,4,5)會把丟進來的參數轉成下列陣列
  //cards=[1,2,3,4,5]
  flipCards(...cards) {
    cards.map(card => {
      if (card.classList.contains('back')) {
        // 回傳正面
        card.classList.remove('back')
        card.innerHTML = this.getCardContent(Number(card.dataset.index))
        return
      }
      // 回傳背面
      card.classList.add('back')
      card.innerHTML = null
    })    
  },

  pairCards(...cards) {
    cards.map(card => {
      card.classList.add('paired')
    })
    
  },
  // pairCard(card) {
  //   card.classList.add('paired')
  // }

  renderScore(score) {
    document.querySelector('.score').textContent = `Score: ${score}`
  },

  renderTriedTimes(times) {
    document.querySelector('.tried').textContent = `You've tried: ${times} times`
  },

  appendWrongAnimation(...cards) {
    cards.map(card => {
      card.classList.add('wrong')
      card.addEventListener('animationend',
        e => {
          card.classList.remove('wrong')
        },
        {
          once: true //只會觸發一次性 觸發完就消失 降低瀏覽器負擔
        }
      )     
    })
  },

  showGameFinished() {
    const div = document.createElement('div')
    div.classList.add('completed')
    div.innerHTML = `
      <p>Complete!</p>
      <p>Score: ${model.score}</p>
      <p>You've tried: ${model.triedTimes} times</p>
    `
    const header = document.querySelector('#header')
    header.before(div)
  }
}

const utility = {
  getRandomNumberArray(count) {
    //例如count = 5 => [2, 3, 4, 1, 0] 隨機生成一個亂數陣列
    const number = Array.from(Array(count).keys())
    // 從最後一張牌，抽出來隨機交換位置洗牌，值到最上面的第二張牌，完成就等於完整洗牌
    for(let index = number.length -1; index > 0; index--) {
      let randomIndex = Math.floor(Math.random() * (index + 1))
      ;[number[index], number[randomIndex]] = [number[randomIndex], number[index]]
    }
    return number
  },
}

const controller = {
  currentState: GAME_STATE.FirstCardAwaits,

  generateCards() {
    view.displayCards(utility.getRandomNumberArray(52))
  },
  // 依照不同的遊戲狀態，做不同的行為
  dispatchCardAction(card) {
    if (!card.classList.contains('back')) {
      return
    }

    switch (this.currentState) {
      case GAME_STATE.FirstCardAwaits:
        view.flipCards(card)
        model.revealedCards.push(card)
        this.currentState = GAME_STATE.SecondCardAwaits
        // break跟return的差異是，break後面的程式還會繼續執行
        break

      case GAME_STATE.SecondCardAwaits:
        view.renderTriedTimes(++model.triedTimes)
        view.flipCards(card)
        model.revealedCards.push(card)

        if (model.isRevealCardsMatched()) {
          //配對正確
          view.renderScore(model.score += 10)
          this.currentState = GAME_STATE.CardsMatched
          view.pairCards(...model.revealedCards)
          // view.pairCard(model.revealedCards[0])
          // view.pairCard(model.revealedCards[1])
          model.revealedCards = []
          if (model.score === 260) {
            console.log('showGameFinished')
            this.currentState = GAME_STATE.GameFinished
            view.showGameFinished()  // 加在這裡
            return
          }
          this.currentState = GAME_STATE.FirstCardAwaits
        } else {
          //配對失敗
          this.currentState = GAME_STATE.CardsMatchFailed
          view.appendWrongAnimation(...model.revealedCards)
          setTimeout(this.resetCards, 1000) //this.resetCards是function,this.resetCards()是呼叫完後的結果
          // setTimeout(() => {
          //   view.flipCards(...model.revealedCards)
          //   model.revealedCards = []
          //   this.currentState = GAME_STATE.FirstCardAwaits
          // }, 1000) //1000=1秒
        } 
        // break跟return的差異是，break後面的程式還會繼續執行
        // if (model.isRevealCardsMatched())        
        break
    }
    console.log('current state:', this.currentState)
    console.log('revealedCards', model.revealedCards.map(card => card.dataset.index))
  },

  resetCards() {
    view.flipCards(...model.revealedCards) 
    model.revealedCards = []    
    controller.currentState = GAME_STATE.FirstCardAwaits
  },

}

const model = {
  revealedCards: [],

  isRevealCardsMatched() {
    return this.revealedCards[0].dataset.index % 13 === this.revealedCards[1].dataset.index % 13
  },

  score: 0,

  triedTimes: 0
}

controller.generateCards()
//抓到的是一個類陣列，但非陣列，所以只能用forEach去展開
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', event => {
    // view.appendWrongAnimation(card)
    controller.dispatchCardAction(card)
  })
})