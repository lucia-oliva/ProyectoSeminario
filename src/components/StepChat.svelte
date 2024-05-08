<script>
    import { Input, Label, Spinner} from 'flowbite-svelte'
    import {appStatusInfo, setAppStatusError, setAppStatusChatMode} from '../store';
    import SvelteMarkdown from 'svelte-markdown';
   
    const {url, pages, id} = $appStatusInfo;
    
    let answer = ''
    let loading =false;
    
    
    const numOfImagesToShow = Math.min(pages,4)
    
    const images = Array.from({ length: numOfImagesToShow}, (_,i) => {
        const page= i+1
        return url 
        .replace('/upload/', `/upload/w_400,h_540,c_fill,pg_${page}/`)
        .replace('.pdf', '.jpg')
    
    })

    const handleSubmit = async (event) => {
        event.preventDefault()
        loading = true
        answer = '';
    const question = event.target.question.value

    const searchParams = new URLSearchParams()
    searchParams.append('id', id)
    searchParams.append('question', question)


    try{
        const res = await fetch(`/api/ask?${searchParams.toString()}`, {

            headers: {
                "Content-Type": "application/json",
            }
        })


        if(!res.ok){
            loading=false
            console.error("Error asking question")
            return
        }

        const responseText = await res.text();
            console.log("Respuesta de la API:", responseText);
            answer = responseText;

    
        
    }catch(e){
        setAppStatusError();
    }finally{
        loading=false
    }
}
    

</script>


    <div class="grid grid-cols-4 gap-2">
        {#each images as image}
            <img class=" border border-purple-500 rounded w-full h-auto aspect-[280/300]" src={image} alt="PDF page" />
        {/each}
    </div>

    <form class="mt-8"on:submit={handleSubmit}>
        <Label for="question" class="block mb-2 text-lg  text-black-700">Ingrese una pregunta:</Label>
        <Input id="question" class="border border-purple-500 bg-purple-100 text-purple-900 px-4 py-2 rounded-md focus:outline-none focus:border-purple-700" required placeholder="¿De que trata este documento?"></Input>
    </form>

    {#if loading}
        <div class="mt-10 flex justify-center items-center flex-col gap-y-2">
            <Spinner color="purple"/>
            <p class="opacity-100">Esperando respuesta... </p>
        </div>
    {/if}

{#if answer}
<div class="mt-8 flex justify-center">
    <div class="max-w-lg w-full bg-purple rounded-lg shadow-xl p-6" >
        <p class="font-short text-black"><strong>Respuesta:</strong></p>
        {#if answer.trim() !==''}
        <p class="mt-2 text-black whitespace-pre-line overflow-auto"><SvelteMarkdown source={answer}/> </p>
        {/if}
    </div>
</div>
   
{/if}

