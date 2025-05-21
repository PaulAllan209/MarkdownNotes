import spinnerSvg from '../assets/Spinner@1x-1.0s-211px-211px.svg';

export function SpinnerLoading() {

    return (
        <div>
            <img src={spinnerSvg} alt='Loading....' width="100" height="100" />
        </div>
    );
}

export default SpinnerLoading;