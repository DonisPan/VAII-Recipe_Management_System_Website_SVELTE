import {supabase} from "$lib/supabase";
import {json} from "@sveltejs/kit";

export async function POST({ params, request, locals }) {
    const id = BigInt(params.slug);
    const currentUser = locals.currentUser;
    const currentRole = locals.currentRole;

    console.group('Update Recipe');
    console.info('Update action triggered for: ', id);

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const difficulty = formData.get('difficulty') as string;
    const description = formData.get('description') as string;
    const imageFile = formData.get('image') as File;

    // LOAD CURRENT RECIPE IMAGE AND OWNER
    const {data: imageData }= await supabase.from('ck_recipe').select('image, user_id').eq('id', id).single()
    let imagePath = imageData?.image;

    console.log('Load recipe image.')

    // CHECK RIGHTS FOR UPDATE
    if (!(currentUser === imageData?.user_id || currentRole === 'superadmin')) {
        console.error('Not authorised to update this recipe');
        return json({ success: false, message: 'Not authorised to update this recipe' });
    }

    // IF NEW IMAGE
    if (imageFile && imageFile.size > 0) {
        const { data: newImageData, error: newImageError } = await supabase.storage
            .from('images')
            .upload(`public/${Date.now()}_${imageFile.name}`, imageFile);
        if (newImageError) {
            console.error('Image upload failed:', newImageError.message);
            return json({ success: false, message: 'Image upload failed' });
        }

        imagePath = newImageData.path;
        console.log('Loaded new image.')
    }

    // UPDATE RECIPE
    const { error: updateRecipeError } = await supabase
        .from('ck_recipe')
        .update({
            name,
            difficulty,
            description,
            image: imagePath,
        })
        .eq('id', id);
    if (updateRecipeError) {
        console.error('Failed to update recipe:',updateRecipeError.message);
        return json({ success: false, message: updateRecipeError.message });
    }

    console.log('Recipe updated');
    console.groupEnd();

    return json({ success: true, message: 'Recipe updated.' });
}