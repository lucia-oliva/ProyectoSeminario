<script>
    import { Input, Label, Spinner} from 'flowbite-svelte'
    import {appStatusInfo, setAppStatusError} from '../store';
    import SvelteMarkdown from 'svelte-markdown';
   
    const {url, pages, id} = $appStatusInfo;
    
    let answer = ''
    let loading =false;
    

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

    <h1 class="animate-fade-down animate-once text-purple-500 text-center text-4xl t"> ¡PDF Listo para Chatear! </h1>
    
    <form class="mt-8"on:submit={handleSubmit}>
        <Label for="question" class="block mb-2 text-lg  text-white">Ingrese una pregunta:</Label>
        <Input id="question" class="border border-purple-500 bg-purple-100 text-purple-900 px-4 py-2 rounded-md focus:outline-none focus:border-purple-700" required placeholder="¿De que trata este documento?"></Input>
    </form>

    {#if loading}
        <div class="mt-10 flex justify-center items-center flex-col gap-y-2">
            <Spinner color="purple"/>
            <p class=" text-white opacity-100">Esperando respuesta... </p>
        </div>
    {/if}

{#if answer}
<div class="mt-8 flex justify-center">
    <div class="max-w-lg w-full bg-purple rounded-lg shadow-xl p-6" >
        <p class="font-short text-white"><strong>Respuesta:</strong></p>
        {#if answer.trim() !==''}
        <p class="mt-2 text-white whitespace-pre-line overflow-auto"><SvelteMarkdown source={answer}/> </p>
        {/if}
    </div>
</div>
   
{/if}

