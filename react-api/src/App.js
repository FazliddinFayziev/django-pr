import React, { useEffect, useState } from 'react'
import './App.css'

const App = () => {

  const [list, setList] = useState([])
  const [todo, setTodo] = useState(
    {
      activeItem: {
        id: null,
        title: '',
        completed: false,
      },
      editing: false
    }
  )

  const { activeItem, editing } = todo


  const fetchTask = () => {
    fetch('http://127.0.0.1:8000/api/task-list/').
      then(res => res.json()).
      then(data =>
        setList(data)
      ).
      catch(err => console.log('Error', err))
  }

  useEffect(() => {
    fetchTask()
  }, [])

  const handleChange = (e) => {
    let name = e.target.name
    let value = e.target.value

    setTodo({ ...todo, activeItem: { ...activeItem, title: value } })
  }

  function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    let csrftoken = getCookie('csrftoken');

    let url = 'http://127.0.0.1:8000/api/task-create/';

    if (editing) {
      url = 'http://127.0.0.1:8000/api/task-update/';
    }

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify(activeItem),
    })
      .then((res) => {
        fetchTask()
        setTodo({
          ...todo,
          activeItem: {
            id: null,
            title: '',
            completed: false,
          },
        });
      })
      .catch((err) => console.log('Error', err));
  };


  const startEdit = (task) => {
    setTodo({
      activeItem: task,
      editing: true,
    })
  }


  return (
    <div className='container'>
      <div id='task-container'>
        <div id='form-wrapper'>
          <form onSubmit={handleSubmit} id='form'>
            <div className='flex-wrapper'>
              <div style={{ flex: 6 }}>
                <input
                  value={activeItem.title}
                  onChange={handleChange}
                  className='form-control'
                  id='title'
                  type="text"
                  name='title'
                  placeholder='Add task'
                />
              </div>

              <div style={{ flex: 1 }}>
                <input id='submit' className='btn btn-warning' type="submit" name='Add' />
              </div>
            </div>
          </form>

        </div>

        <div id='list-wrapper'>

          {
            list.map((task, index) => {
              return (
                <div key={index} className='task-wrapper flex-wrapper'>

                  <div style={{ flex: 7 }}>
                    <span>{task.title}</span>
                  </div>

                  <div style={{ flex: 1 }}>
                    <button onClick={() => startEdit(task)} className="btn btn-sm btn-outline-info">Edit</button>
                  </div>

                  <div style={{ flex: 1 }}>
                    <button onClick={''} className="btn btn-sm btn-outline-dark delete">-</button>
                  </div>

                </div>
              )
            })
          }

        </div>

      </div>
    </div>
  )
}

export default App