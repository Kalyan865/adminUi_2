import './index.css'

const NavButton = props => {
  const {number, navButtonClick} = props
  const navBtnClick = () => {
    navButtonClick(number)
  }
  return (
    <button className="navButton" type="button" onClick={navBtnClick}>
      {number}
    </button>
  )
}

export default NavButton
