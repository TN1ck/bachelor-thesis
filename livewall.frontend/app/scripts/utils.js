export var calculateColumns = function (width) {
    
    var screens = {
        large: 1200,
        desktop: 992,
        tablet: 768,
        phone: 480
    }

    var columns = 1;

    if (width > screens.large) {
        columns = 4;
    } else if (width > screens.desktop) {
        columns = 4;
    } else if (width > screens.tablet) {
        columns = 3;
    } else if (width > screens.phone) {
        columns = 2;
    }

    return columns;

};