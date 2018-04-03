import AutoComplete from 'material-ui/AutoComplete'
import createComponent from './createComponent'
import mapError from './mapError'
import MenuItem from 'material-ui/MenuItem/index'

function extractValue (input, dataSourceConfig) {
  const value = input[dataSourceConfig.value]

  if (value.type && (value.type.muiName === MenuItem.muiName)) {
    return value.props.value
  }

  return value
}

export default createComponent(AutoComplete, ({
  input: { onChange, onBlur, value, ...inputRest },
  onNewRequest,
  onUpdateInput,
  dataSourceConfig,
  dataSource,
  ...props
}) => ({
  ...mapError({ ...props, input: { onBlur() {onBlur()}, ...inputRest } }),
  dataSourceConfig,
  dataSource,
  searchText: dataSourceConfig && dataSource ? (
    dataSource.find((item) => extractValue(item, dataSourceConfig) === value) ||
    dataSource.find((item) => item[dataSourceConfig.text] === value) ||
    { [dataSourceConfig.text]: value }
  )[dataSourceConfig.text] : value,
  onNewRequest: value => {
    const option = Object.assign({}, value, {value: extractValue(value, dataSourceConfig)})
    onChange(
      typeof option === 'object' && dataSourceConfig
        ? option[dataSourceConfig.value]
        : option
    )
    if (onNewRequest) {
      onNewRequest(option)
    }
  },
  onUpdateInput: (value, ...restArgs) => {
    if (!dataSourceConfig) {
      onChange(value)
    }

    if (onUpdateInput) {
      onUpdateInput(value, ...restArgs)
    }
  }
}))
