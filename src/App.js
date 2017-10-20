import React, { Component } from 'react';
import './styles/css/App.css'

const API_URL = 'http://ec2-13-59-135-248.us-east-2.compute.amazonaws.com:3000';

const SuccessBox = props => {
  const {
    winLose,
  } = props;
  return (
    <div className='box success'>
      You've registered successfully and.. <span className={ winLose === 'Lost' ? 'lost' : null }> { winLose && `${winLose}!` } </span>

    </div>
  )
}

const ErrorBox = props => {
  const {
    error
  } = props;
  return (
    <div className='box error'>
      { error && error }

    </div>
  )
}

//*********************


const RegistrationForm = props => {
  const {
    handleSubmit,
    handleChange,
  } = props;
  return (
    <form id='mainForm' onSubmit={ handleSubmit }>
      <input className='question' spellCheck='false' type='text' required  placeholder='name' name='name' onChange={ handleChange } />
      <input className='question' spellCheck='false' type='email' required  placeholder='email' name='email'  onChange={ handleChange } />
      <button className='submit' type='submit'>
        Submit
      </button>
    </form>
  )
}

const DataContainer = props => {
  const {
    applicantID,
    error,
    userDetails,
  } = props;
  console.log(userDetails);
  return (
    <div className='data-container'>
      <header>
        Child Registration:
      </header>
      <div className='container'>
        {
          applicantID &&
          <SuccessBox winLose={ userDetails.status }/>
        }
        {
          error &&
          <ErrorBox error={ error } />
        }

        <a href='/' className='anotherChild'>Try another child</a>
      </div>
    </div>
  )
}

class App extends Component {
  state = {
    welcomeMessage: '',
    name: '',
    email: '',
    applicantID: '',
    userDetails: {
      'status': '',
    },
    error: '',
  }
  componentDidMount = () => {
    this.getWelcome();
  }
  getWelcome = () => {
    fetch(API_URL)
      .then( res => {
        if (res.status === 200) {
          return res.json()
        } else {
          throw res.json()
        }
      })
      .then( json => {
        this.setState({
          welcomeMessage: json,
        })
      })
      .catch( error => {
        return error;
      }).then( error => {
        if (error) {
          this.setState({
            error: error.message,
            applicantID: '',
            uesrDetails: {
              status: ''
            }
          })
        }
      });
  }
  checkStatus = (applicantID) => {
    fetch(`${API_URL}/status/${applicantID}`)
      .then( res => {
        if (res.status === 200) {
          return res.json()
        } else {
          throw res.json()
        }
      })
      .then( json => {
        this.setState({
          userDetails: {
            status:  json.status
          }
        })
      })
      .catch( error => {
        return error;
      }).then( error => {
        if (error) {
          this.setState({
            error: error.message,
            applicantID: '',
            uesrDetails: {
              status: ''
            }
          })
        }
      });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    console.log("almost there!");
    fetch(`${API_URL}/entries`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        'applicant_name': this.state.name,
        'applicant_email': this.state.email
      })
    })
    .then( res => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw res.json()
      }
    })
    .then( json => {
      const parsedJSON = JSON.parse(json);
      this.setState({
        applicantID: parsedJSON.applicant_id,
        error: ''
      })
      this.checkStatus(parsedJSON.applicant_id);
    })
    .catch( error => {
      return error;
    }).then( error => {
      if (error) {
        this.setState({
          error: error.message,
          applicantID: '',
          uesrDetails: {
            status: ''
          }
        })
      }
    });
  }
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })

  }

  render() {
    const {
      welcomeMessage,
      userDetails,
      error,
      applicantID,
    } = this.state;
    return (
      <div className='App'>
        <div className='welcome-message'>
          { welcomeMessage.message }
        </div>
        <div className='task-message'>
          Register below to find out if your child has won or lost a chance to take a tour of Charlie's chocolate factory. <span>Good luck</span>!
        </div>
        <RegistrationForm
          handleSubmit={ this.handleSubmit }
          handleChange={ this.handleChange }
        />
        {
         ((applicantID && userDetails) || error) &&
          <DataContainer
            applicantID={ applicantID }
            userDetails={ userDetails }
            error={ error }
          />
        }
      </div>
    );
  }
}

export default App;