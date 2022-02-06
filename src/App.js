import {Component} from 'react'
import ListItems from './components/ListItems'
import NavButton from './components/NavButton'
import './App.css'

class App extends Component {
  state = {
    searchValue: '',
    fetched: false,
    listData: [],
    searchedDate: [],
    maxButtonNumber: 0,
    maximumButtonsAppear: 4,
    maximumNumberOfButtonsCanBeVisible: 4,
    maximumNumberOfItemsPerPage: 9,
    endIndex: 9,
  }

  componentDidMount() {
    this.getDetailsFromApi()
  }

  getDetailsFromApi = async () => {
    const response = await fetch(
      'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json',
    )
    const data = await response.json()
    const dataWithCheckStatus = data.map(item => ({
      id: item.id,
      name: item.name,
      email: item.email,
      role: item.role,
      checkBoxStatus: false,
    }))

    await this.setState({
      listData: dataWithCheckStatus,
      fetched: true,
    })

    await this.lengthOfButtonArray(dataWithCheckStatus.length)
  }

  inputSearch = event => {
    this.setState({searchValue: event.target.value})
    const {listData} = this.state
    const temporaryFreshList = listData.filter(
      item =>
        item.name.toLowerCase().includes(event.target.value.toLowerCase()) ||
        item.email.toLowerCase().includes(event.target.value.toLowerCase()) ||
        item.role.toLowerCase().includes(event.target.value.toLowerCase()) ||
        item.id.includes(event.target.value),
    )
    this.lengthOfButtonArray(temporaryFreshList.length)
  }

  lengthOfButtonArray = length1 => {
    const maxButton = Math.ceil(length1 / 9)
    this.setState({maxButtonNumber: maxButton})
  }

  checkBoxClicked = id => {
    const {listData} = this.state
    const itemIndex = listData.findIndex(item => item.id === id)
    listData[itemIndex].checkBoxStatus = !listData[itemIndex].checkBoxStatus
    this.setState({listData: listData})
  }

  deleteBtnClick = id => {
    const {listData} = this.state
    const listAfterDelete = listData.filter(item => item.id !== id)
    this.setState({listData: listAfterDelete})
  }

  deleteSelectClicked = () => {
    const {listData} = this.state
    const listAfterDeleteSelected = listData.filter(
      item => item.checkBoxStatus === false,
    )
    this.setState({listData: listAfterDeleteSelected})
  }

  deleteAllClicked = () => {
    this.setState({listData: []})
  }

  headRowCheckbox = event => {
    const {listData} = this.state
    const newChecklist =
      event.target.checked === true
        ? listData.map(item => ({
            id: item.id,
            name: item.name,
            email: item.email,
            role: item.role,
            checkBoxStatus: true,
          }))
        : listData.map(item => ({
            id: item.id,
            name: item.name,
            email: item.email,
            role: item.role,
            checkBoxStatus: false,
          }))
    this.setState({listData: newChecklist})
  }

  navButtonClick = number => {
    const {maximumNumberOfItemsPerPage} = this.state
    this.setState({endIndex: number * maximumNumberOfItemsPerPage})
  }

  nameChanged = (name, id) => {
    const {listData} = this.state
    const itemIndex = listData.findIndex(item => item.id === id)
    listData[itemIndex].name = name
    this.setState({listData: listData})
  }

  emailChanged = (email, id) => {
    const {listData} = this.state
    const itemIndex = listData.findIndex(item => item.id === id)
    listData[itemIndex].email = email
    this.setState({listData: listData})
  }

  nextButtonClicked = () => {
    const {
      maxButtonNumber,
      maximumButtonsAppear,
      maximumNumberOfButtonsCanBeVisible,
    } = this.state
    if (maximumButtonsAppear <= maxButtonNumber) {
      this.setState(prev => ({
        maximumButtonsAppear:
          prev.maximumButtonsAppear + maximumNumberOfButtonsCanBeVisible,
      }))
    }
  }

  previousButtonClicked = () => {
    const {
      maximumButtonsAppear,
      maximumNumberOfButtonsCanBeVisible,
    } = this.state
    if (maximumButtonsAppear - maximumNumberOfButtonsCanBeVisible > 0) {
      this.setState(prev => ({
        maximumButtonsAppear:
          prev.maximumButtonsAppear - maximumNumberOfButtonsCanBeVisible,
      }))
    }
  }

  render() {
    const {
      searchValue,
      listData,
      fetched,
      endIndex,
      maximumButtonsAppear,
      maximumNumberOfButtonsCanBeVisible,
      maximumNumberOfItemsPerPage,
    } = this.state
    const startIndex = endIndex - 9
    const freshList = listData.filter(
      item =>
        item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.email.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.role.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.id.includes(searchValue),
    )

    let buttonNumber = []
    const largeButton = Math.ceil(
      freshList.length / maximumNumberOfItemsPerPage,
    )
    for (let num = 1; num <= largeButton; num++) {
      buttonNumber.push(num)
    }
    let slicedButtonArray = []
    let minimumButtonsAppear =
      maximumButtonsAppear - maximumNumberOfButtonsCanBeVisible

    if (buttonNumber.length > maximumButtonsAppear) {
      slicedButtonArray = buttonNumber.slice(
        minimumButtonsAppear,
        maximumButtonsAppear,
      )
    } else if (buttonNumber.length > minimumButtonsAppear) {
      slicedButtonArray = buttonNumber.slice(
        minimumButtonsAppear,
        maximumButtonsAppear,
      )
    }

    const sliceList = freshList.slice(startIndex, endIndex)

    return (
      <div className="BackgroundContainer">
        <input
          className="inputElement"
          type="search"
          placeholder="Search id name, mail, role"
          value={searchValue}
          onChange={this.inputSearch}
        />

        <div className="listsContainer">
          <div className="checkBoxHeadRowContainer">
            <div className="checkBoxContainer">
              <input
                className="checkBoxOfHeadRow"
                type="checkbox"
                onClick={this.headRowCheckbox}
              />
            </div>
            <div className="listHeaderRowContainer">
              <p className="headerRowId">Id</p>
              <p className="headerRowName">Name</p>
              <p className="headerRowEmail">Email</p>
              <p className="headerRowRole">Role</p>
            </div>
          </div>

          <ul className="listItemsContainer">
            {fetched &&
              sliceList.map(item => (
                <ListItems
                  item={item}
                  key={item.id}
                  checkBoxClicked={this.checkBoxClicked}
                  deleteBtnClick={this.deleteBtnClick}
                  nameChanged={this.nameChanged}
                  emailChanged={this.emailChanged}
                />
              ))}
          </ul>
        </div>

        <div className="navigationDeleteContainer">
          <button
            className="DeleteSelectedButton"
            type="button"
            onClick={this.deleteSelectClicked}
          >
            Delete
          </button>

          <button
            className="navButtonLessThan"
            type="button"
            onClick={this.previousButtonClicked}
          >
            &lt;&lt;
          </button>

          <div className="navigationButtonsContainer">
            {slicedButtonArray.map(number => (
              <NavButton
                number={number}
                key={number}
                navButtonClick={this.navButtonClick}
              />
            ))}
          </div>

          <button
            className="navButtonLessThan"
            type="button"
            onClick={this.nextButtonClicked}
          >
            &gt;&gt;
          </button>

          <button
            className="DeleteSelectedButton buttonDeleteAll"
            type="button"
            onClick={this.deleteAllClicked}
          >
            Delete All
          </button>
        </div>
      </div>
    )
  }
}

export default App
