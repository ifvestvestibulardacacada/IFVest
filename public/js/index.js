import symbolButtons from "./symbolButtons.js"
import Button from "../core/entity/button.js"


/// Editor buttons ///////////////////////////////////////////////////////////////////////////
const equationInput = document.querySelector('#equation-input')
const equationPreview = document.querySelector('#equation-preview')
const insertBtn = document.querySelector('#insert-btn')
const clearBtn = document.querySelector('#clear-btn')
const editorBtn = document.querySelector("#editor-open-btn")
const editorCloseBtn = document.querySelector("#editor-close-btn")
const editorBox = document.querySelector('#editor-box')
const symbolsBox = document.querySelector("#symbols-box")
const symbolsBoxBtn = document.querySelector("#symbols-box-btn")
const editorContainer = document.querySelector(".editor-container")

// Sections elements /////////////////////////////////////////////////////////////////////////
// Main section
const section_1 = document.querySelector("#section-1")
const section_1_btn = document.querySelectorAll("#section-1 button")
const hiddenSection_1 = document.querySelector("#hidden-section-1")

// Constants Section
const constantsSection = document.querySelector("#constants-section")
const constantsSectionButtons = document.querySelectorAll("#constants-section button")
const hiddenConstantsSection = document.querySelector("#hidden-constants-section")

// Logical Section
const logicalSection = document.querySelector("#logical-section")
const logicalSectionButtons = document.querySelectorAll("#logical-section button")
const hiddenLogicalSection = document.querySelector("#hidden-logical-section")

// Arithmetic Comparison section
const comparisonSection = document.querySelector("#comparison-section")
const comparisonSectionButtons = document.querySelectorAll("#comparison-section button")
const hiddenComparisonSymbols = document.querySelector("#hidden-comparison-symbols")

/// Editor event listeners ///////////////////////////////////////////////////////////////////
equationInput.addEventListener('keyup', () => {
    equationInput.value = equationInput.value.replaceAll('*', '⋅')
    equationPreview.innerHTML = `\\(${equationInput.value}\\)`
    MathJax.Hub.Typeset()
    equationInput.focus();

    // MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
})

clearBtn.addEventListener('click', () => {
    equationPreview.innerHTML = equationInput.value = '';
    equationInput.focus();
    equationPreview.style.fontSize = '30px'
})

symbolsBoxBtn.addEventListener('click', () => {
    symbolsBox.classList.toggle('hide');
})
editorCloseBtn.addEventListener('click', () => {
    editorBox.classList.add('hide');
    symbolsBox.classList.add('hide');
})


editorBtn.addEventListener('click', () => {
    editorBox.classList.remove('hide');
    equationInput.focus();
})

/// Sections event listeners //////////////////////////////////////////////////////////////////
section_1_btn.forEach(element => {
    element.addEventListener('mouseover', () => {
        hiddenSection_1.classList.remove('hide')
    })
})
section_1_btn.forEach(element => {
    element.addEventListener('mouseout', () => {
        hiddenSection_1.classList.add('hide')
    })
})
section_1.addEventListener('mouseover', () => {
    hiddenSection_1.classList.remove('hide')
})
section_1.addEventListener('mouseout', () => {
    hiddenSection_1.classList.add('hide')
})
constantsSectionButtons.forEach(element => {
    element.addEventListener('mouseover', () => {
        hiddenConstantsSection.classList.remove('hide')
    })
})
constantsSectionButtons.forEach(element => {
    element.addEventListener('mouseout', () => {
        hiddenConstantsSection.classList.add('hide')
    })
})
constantsSection.addEventListener('mouseover', () => {
    hiddenConstantsSection.classList.remove('hide')
})
constantsSection.addEventListener('mouseout', () => {
    hiddenConstantsSection.classList.add('hide')
})
logicalSectionButtons.forEach(element => {
    element.addEventListener('mouseover', () => {
        hiddenLogicalSection.classList.remove('hide')
    })
})
logicalSectionButtons.forEach(element => {
    element.addEventListener('mouseout', () => {
        hiddenLogicalSection.classList.add('hide')
    })
})
logicalSection.addEventListener('mouseover', () => {
    hiddenLogicalSection.classList.remove('hide')
})
logicalSection.addEventListener('mouseout', () => {
    hiddenLogicalSection.classList.add('hide')
})
comparisonSectionButtons.forEach(element => {
    element.addEventListener('mouseover', () => {
        hiddenComparisonSymbols.classList.remove('hide')
    })
})
comparisonSectionButtons.forEach(element => {
    element.addEventListener('mouseout', () => {
        hiddenComparisonSymbols.classList.add('hide')
    })
})
comparisonSection.addEventListener('mouseover', () => {
    hiddenComparisonSymbols.classList.remove('hide')
})
comparisonSection.addEventListener('mouseout', () => {
    hiddenComparisonSymbols.classList.add('hide')
})

insertBtn.addEventListener('click', () => {
    var latex = equationPreview.outerHTML;
    var range = quill.getSelection(true);
    quill.deleteText(range.index, range.length);
    quill.insertEmbed(range.index, 'mathjax', latex);
    quill.insertText(range.index + range.length + 1 , ' ');
    quill.setSelection(range.index + range.length + 1);
    symbolsBox.classList.add('hide');
    editorContainer.classList.add('hide');
});

symbolButtons.forEach(element => {

    let button = new Button();

    button.setButton(element.button)
    button.setValue(element.value)

    element.button.addEventListener('click', () => {
        let start_position = equationInput.selectionStart;
        let end_position = equationInput.selectionEnd;

        equationInput.value = `${equationInput.value.substring(0, start_position)}${element.value}${equationInput.value.substring(end_position, equationInput.value.length)}`
        equationInput.focus()
        equationPreview.innerHTML = `\\(${equationInput.value}\\)`
        MathJax.Hub.Typeset()
    })
})

