const checkdetails = (values) => {
    let errors = {};
    const date = new Date();
    const hrs = date.getHours();
    if (!values.Date || values.Date < date) {
        errors.Date = 'Invalid Date';
    }
    else if(values.Date===date){
        errors.Date='today'
    } 
    else {
        errors.Date = ' ';
    }

    if (errors.Date==='today' && (!values.aTime || values.aTime.getHours() < hrs)) {
        errors.aTime = 'Invalid time';
    } else {
        errors.aTime = ' ';
    }

    if (errors.Date==='today' && (!values.dTime || values.dTime.getHours() < hrs)) {
        errors.dTime = 'Invalid time';
    } else {
        errors.dTime = ' ';
    }
    
    return errors;
};

export default checkdetails;
