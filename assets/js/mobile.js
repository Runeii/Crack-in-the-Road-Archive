_docHeight = (document.height !== undefined) ? document.height : document.body.offsetHeight;
header = document.getElementById('header');
relatedPane = null;
relatedState = true;


if(document.getElementById('single-related')) {
    body.style.minHeight = _docHeight + 'px';
    relatedPane = document.getElementById('single-related');
    relatedPane.classList.remove('free');
    relatedTriggerHeight = (document.getElementById('wrapper').offsetHeight - header.offsetHeight);

    document.querySelector('#single-related .header').addEventListener('click', function(event) {  
        relatedPane.classList.toggle('flip');
    }, false);
}

window.onscroll = function (event) {
    if(relatedPane != null) {
        captureRelease();
    }
};

function captureRelease() {
    var s = window.pageYOffset;

    if(s >= relatedTriggerHeight && relatedState == true) {
        relatedPane.classList.add('free');
        relatedState = false;
        console.log('Ran');
    } else if(s <= relatedTriggerHeight && relatedState == false) {
        relatedPane.classList.remove('free');
        relatedState = true;
        console.log('Ran2');
    }

}