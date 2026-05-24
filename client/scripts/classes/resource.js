class Resource {
    constructor() {
        this.displayName = ""
        this.ammount = 0
        this.max = 0
        this.recovery = ''
        this._el = null
        this.__numEl = null
        this.__inpEl = null
    }

    getMax() {
        if (typeof (this.max) == 'object') {
            let m = this.max[0]
            for (let i = 1; i < char.level; i++) {
                m = this.max[i] ?? m
            }
            return m
        }
        if (typeof (this.max) == 'number')
            return this.max
        return -1
    }

    makeEl() {
        const div = document.createElement('div')
        this._el = div
        div.classList.add('resourceBox')
        const nameEl = document.createElement('h4')
        nameEl.innerText = this.displayName
        div.appendChild(nameEl)
        
        const numEl = document.createElement('p')
        numEl.innerText = `${this.ammount} / ${this.getMax()}`
        div.appendChild(numEl)
        this.__numEl = numEl

        const inpEl = document.createElement('input')
        inpEl.type = 'text'
        inpEl.value = 1
        this.__inpEl = inpEl
        div.appendChild(inpEl)

        const useBtn = document.createElement('button')
        useBtn.innerText = 'Use'
        useBtn.onclick = () => {
            let temp = this.ammount - Number(this.__inpEl.value)
            if (temp < 0)
                temp = 0
            if (temp == this.ammount)
                return
            this.ammount = temp
            this.updateEl()
            makeDirty()
        }
        div.appendChild(useBtn)
        
        const setBtn = document.createElement('button')
        setBtn.innerText = 'Set'
        setBtn.onclick = () => {
            let temp = Number(this.__inpEl.value)
            if (temp < 0)
                temp = 0
            if (temp > this.getMax())
                temp = this.getMax()
            if (temp == this.ammount)
                return
            this.ammount = temp
            this.updateEl()
            makeDirty()
        }
        div.appendChild(setBtn)

        return div
    }

    updateEl() {
        if (!this._el)
            return;
        this.__numEl.innerText = `${this.ammount} / ${this.getMax()}`
    }

    recover(type) {
        if (this.recovery == '')
            return
        if ((type == 'shortRest' && recovery == 'shortRest') || type == 'longRest') {
            this.ammount = this.getMax()
            this.updateEl()
        }
    }
}