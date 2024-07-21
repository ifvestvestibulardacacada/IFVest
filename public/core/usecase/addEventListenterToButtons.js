import Button from "../entities/button";

symbolButtons.forEach(element => {
    
    let button = new Button();
    
    button.setButton(element.button)
    button.setValue(element.value)

    element.button.addEventListener('click', () => {
        let start_position = equationInput.selectionStart;
        let end_position = equationInput.selectionEnd;
        
        equationInput.value = `${equationInput.value.substring(0, start_position)}${element.value}${equationInput.value.substring(end_position,equationInput.value.length)}`
        equationInput.focus()
        equationPreview.innerHTML = `\\(${equationInput.value}\\)`
        MathJax.Hub.Typeset()
    })
})