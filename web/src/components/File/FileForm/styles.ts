const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#7a7777',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#1e1d1d',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  marginTop: '20px',
}

const focusedStyle = {
  borderColor: '#2196f3',
}

const acceptStyle = {
  borderColor: '#00e676',
}

const rejectStyle = {
  borderColor: '#ff1744',
}

export { baseStyle, focusedStyle, acceptStyle, rejectStyle }
