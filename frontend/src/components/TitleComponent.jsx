
const TitleComponent = ({name}) => {
    return (
        <div class="flex justify-center space-x-7 items-center my-4 text-center">
            <h1 class="text-3xl md:text-4xl font-bold uppercase animate-fade-down mb-4">{name}</h1>
        </div>
    );
};

export default TitleComponent;