class Resource {
    constructor() {
        this.displayName = ""
        this.ammount = 0
        this.max = 0
        this.recovery = ''
        this._el = null
        this.__numEl = null
        this.__maxEl = null
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
        
        const pEl = document.createElement('p')
        // pEl.innerText = `${this.ammount} / ${this.getMax()}`
        div.appendChild(pEl)

        const numEl = document.createElement('input')
        numEl.type = 'number'
        numEl.classList.add('invisInput')
        numEl.value = this.ammount
        numEl.onchange = () => {
            let temp = Number(this.__numEl.value)
            if (temp < 0)
                temp = 0
            else if (temp > this.getMax())
                temp = this.getMax()
            this.__numEl.value = temp
            if (temp == this.ammount)
                return
            this.ammount = temp
            makeDirty()
        }
        this.__numEl = numEl
        pEl.appendChild(numEl)

        const s = document.createElement('span')
        s.innerText = ' / '
        pEl.appendChild(s)

        
        const maxEl = document.createElement('input')
        maxEl.type = 'number'
        maxEl.classList.add('invisInput')
        maxEl.disabled = true
        maxEl.value = this.getMax()
        pEl.appendChild(maxEl)
        this.__maxEl = maxEl;

        const inpEl = document.createElement('input')
        inpEl.type = 'number'
        inpEl.value = 1
        this.__inpEl = inpEl
        div.appendChild(inpEl)

        const useBtn = document.createElement('button')
        useBtn.innerText = 'Use'
        useBtn.onclick = () => {
            let temp = this.ammount - (Number(this.__inpEl.value) ?? 0)
            if (temp < 0)
                temp = 0
            if (temp == this.ammount)
                return
            this.ammount = temp
            this.updateEl()
            makeDirty()
        }
        div.appendChild(useBtn)
        
        // const setBtn = document.createElement('button')
        // setBtn.innerText = 'Set'
        // setBtn.onclick = () => {
        //     let temp = Number(this.__inpEl.value)
        //     if (temp < 0)
        //         temp = 0
        //     if (temp > this.getMax())
        //         temp = this.getMax()
        //     if (temp == this.ammount)
        //         return
        //     this.ammount = temp
        //     this.updateEl()
        //     makeDirty()
        // }
        // div.appendChild(setBtn)

        return div
    }

    updateEl() {
        if (!this._el)
            return;
        this.__numEl.value = this.ammount
        this.__maxEl.value = this.getMax()
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