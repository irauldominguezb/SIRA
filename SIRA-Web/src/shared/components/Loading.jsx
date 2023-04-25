
import styled, {keyframes} from 'styled-components'

const rotate360 = keyframes`
    from{
        transform: rotate(0deg);
    }to{
        transform: rotate(360deg)
    }`

const Spinner = styled.div`
    margin: 16px;

    animation: ${rotate360} 0.8s linear infinite;
    transform: translateZ(0);
    border-top: 4px solid #16AE8877;
    border-right: 5px solid #002957;
    border-bottom: 4px solid #16AE8877;
    border-left: 5px solid #002957;
    background: transparent;
    width: 80px;
    height: 80px;
    border-radius:100%;
`
export const Loading = () => {
    return (
        <div style={{padding: '24px'}}>
            <Spinner/>
        </div>
    )
}