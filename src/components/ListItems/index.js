import './index.css'

const ListItems = props => {
  const {
    item,
    checkBoxClicked,
    deleteBtnClick,
    nameChanged,
    emailChanged,
  } = props
  const {id, name, email, role, checkBoxStatus} = item

  let checkBoxClick = event => {
    checkBoxClicked(id)
  }

  let deleteBtnClicked = event => {
    deleteBtnClick(id)
  }

  let nameChange = event => {
    nameChanged(event.target.value, id)
  }

  let emailChange = event => {
    emailChanged(event.target.value, id)
  }

  return (
    <li className="personDetails">
      <div className="checkBoxContainer">
        <input
          className="checkBoxOfHeadRow"
          type="checkbox"
          onChange={checkBoxClick}
          id={`checked${id}`}
          checked={checkBoxStatus}
        />
      </div>

      <label
        className={`personDetails2 changeBg${checkBoxStatus}`}
        htmlFor={`checked${id}`}
      >
        <p className="personId">{id}</p>
        <input
          type="text"
          className="personName"
          value={name}
          onChange={nameChange}
        />
        <input
          type="text"
          className="personEmail"
          value={email}
          onChange={emailChange}
        />
        <p className="personRole">{role}</p>
        <p className="deleteBtn" onClick={deleteBtnClicked}>
          x
        </p>
      </label>
    </li>
  )
}

export default ListItems
