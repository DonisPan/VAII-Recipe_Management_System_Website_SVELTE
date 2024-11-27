
export const load: ({params}: { params: any }) => { recipeId: string } = ({ params }) => {
    return {
        recipeId: params.slug
    };
};