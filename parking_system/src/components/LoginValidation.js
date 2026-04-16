const validation = (values) => {
        let errors = {};
      
        // Validate email
        if (!values.email) {
          errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
          errors.email = 'Invalid email format';
        }else{
            errors.email=''
        }
      
        // Validate password
        if (!values.password) {
          errors.password = 'Password is required';
        } else{
            errors.password=''
        }
      
        return errors;
      };


export default validation;

const signupValidation = (values) => {
    let errors = {};
  
    // Validate name
    if (!values.username) {
      errors.username = 'Name is required';
    }else{
      errors.username='';
    }
  
    // Validate email
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Invalid email format';
    }else{
      errors.email='';
    }
  
    // Validate password
    if (!values.password) {
      errors.password = 'Password is required';
    } else{
        errors.password='';
    }
  
    return errors;
  };

export {signupValidation};
