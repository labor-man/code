export default class ColorGUIHelper{
    constructor(object, prop){
        this.object = object
        this.prop = prop
    }

    get value(){
        return `#${this.object[this.prop].getHexString()}`;
    }

    set value(value){
        this.object[this.prop].set(value)
    }
}
