export function changeStatus(){
    let selected = document.getElementsByClassName('grey-bg');
    let notSelected = document.getElementsByClassName('transparent-bg');
    let first = selected.item(0); 
    let second = notSelected.item(0); 

    first.classList.remove('grey-bg');
    first.classList.add('transparent-bg');
    second.classList.remove('transparent-bg');
    second.classList.add('grey-bg');
}
