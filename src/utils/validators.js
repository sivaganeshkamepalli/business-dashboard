/**
 * Validate login form fields.
 * Returns an errors object { name, mobile }.
 */
export function validateLogin({ name, mobile }) {
  const errors = {};

  if (!name || name.trim() === '') {
    errors.name = 'Name is required.';
  } else if (name.trim().length < 3) {
    errors.name = 'Name must be at least 3 characters.';
  } else if (!/^[A-Za-z\s]+$/.test(name.trim())) {
    errors.name = 'Name should contain only alphabets and spaces.';
  }

  if (!mobile || mobile.trim() === '') {
    errors.mobile = 'Mobile number is required.';
  } else if (!/^\d{10}$/.test(mobile.trim())) {
    errors.mobile = 'Mobile number must be exactly 10 digits.';
  }

  return errors;
}

/**
 * Validate a single employee record row.
 * Returns an errors object { name, salary, gender, distance }.
 */
export function validateEmployee({ name, salary, gender, distance }) {
  const errors = {};

  if (!name || name.trim() === '') {
    errors.name = 'Name is required.';
  } else if (name.trim().length < 3) {
    errors.name = 'Min 3 characters.';
  } else if (!/^[A-Za-z\s]+$/.test(name.trim())) {
    errors.name = 'Alphabets only.';
  }

  if (salary === '' || salary === undefined || salary === null) {
    errors.salary = 'Salary is required.';
  } else if (isNaN(Number(salary)) || Number(salary) <= 0) {
    errors.salary = 'Must be a positive number.';
  }

  if (!gender) {
    errors.gender = 'Gender is required.';
  }

  if (distance === '' || distance === undefined || distance === null) {
    errors.distance = 'Required.';
  } else if (isNaN(Number(distance)) || Number(distance) < 0) {
    errors.distance = 'Must be a valid number.';
  }

  return errors;
}
