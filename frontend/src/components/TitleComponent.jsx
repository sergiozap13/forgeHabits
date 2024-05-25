
const TitleComponent = ({name}) => {
    return (
        <div class="flex justify-center space-x-7 items-center m-3 text-center">
            <h1 class="text-4xl font-bold uppercase animate-fade-down mb-4">{name}</h1>
        </div>
    );
};

export default TitleComponent;