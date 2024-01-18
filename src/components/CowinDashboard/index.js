// Write your code here
import {Component} from 'react'

import VaccinationCoverage from '../VaccinationCoverage'

import VaccinationByAge from '../VaccinationByAge'

import VacciantionByGender from '../VaccinationByGender'

import Loader from 'react-loader-spinner'

const apiStatusconstants = {
  inital: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inPrograss: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {newArr: {}, statusReq: apiStatusconstants.inital}

  componentDidMount() {
    this.apiRequest()
  }

  apiRequest = async () => {
    this.setState({statusReq: apiStatusconstants.inPrograss})
    const vaccinationDataApiUrl = 'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(vaccinationDataApiUrl)

    if (response.ok === true) {
      const data = await response.json()
      const retriveData = {
        last7DayaVaccination: data.last_7_days_vaccination.map(eachData => ({
          vaccineData: eachData.vaccine_date,
          dose1: eachData.dose_1,
          dose2: eachData.dose_2,
        })),
        vacciantionByAge: data.vaccination_by_age.map(eachVacc => ({
          age: eachVacc.age,
          count: eachVacc.count,
        })),
        vacciantionByGender: data.vaccination_by_gender.map(eachGender => ({
          gender: eachGender.gender,
          count: eachGender.count,
        })),
      }
      this.setState({
        newArr: retriveData,
        statusReq: apiStatusconstants.success,
      })
    } else {
      this.setState({statusReq: apiStatusconstants.failure})
    }
  }

  renderData = () => {
    const {newArr} = this.state
    return (
      <div>
        <VaccinationCoverage vaccineData={newArr.last7DayaVaccination} />
        <VaccinationByAge vacciantionPiedata={newArr.vacciantionByAge} />
        <VacciantionByGender vacciantionByGender={newArr.vacciantionByGender} />
      </div>
    )
  }

  renderDataFail = () => {
    return (
      <div>
        <h1>Something went wrong</h1>
        <img
          src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
          alt="website logo"
        />
      </div>
    )
  }

  renderLoder = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )
  renderMainFun = () => {
    const {statusReq} = this.props
    switch (statusReq) {
      case apiStatusconstants.success:
        return renderData()
      case apiStatusconstants.failure:
        return renderDataFail()
      case apiStatusconstants.inPrograss:
        return renderLoder()
      default:
        return null
    }
  }
  render() {
    return (
      <>
        <img
          src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
          alt="website logo"
        />
        <h1>CoWin Vaccination in india</h1>
        {this.renderMainFun()}
      </>
    )
  }
}

export default CowinDashboard
