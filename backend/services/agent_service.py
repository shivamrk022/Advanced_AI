import os
from groq import Groq

def _call_groq(prompt: str, system: str = "You are a helpful AI assistant.", temperature: float = 0.5) -> str:
    groq_key = os.getenv("GROQ_API_KEY")
    if not groq_key or not groq_key.strip():
        raise ValueError("GROQ_API_KEY is not set or empty")
    
    client = Groq(api_key=groq_key.strip())
    
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": prompt}
        ],
        temperature=temperature,
        max_tokens=2048,
    )
    return completion.choices[0].message.content.strip()

def get_planner_output(task: str, mode: str) -> str:
    system_prompt = "You are an expert AI Planner Agent."
    prompt = f"Task: {task}\nMode: {mode}\nBreak this task into clear, logical steps. Identify the main goal, target audience/user, required output, and a high-level execution plan."
    try:
        return _call_groq(prompt, system_prompt, 0.4)
    except Exception as e:
        print(f"Planner Error: {e}")
        return f"Fallback Planner Output:\n1. Goal: Complete the task '{task}' in {mode} mode.\n2. Audience: General.\n3. Plan: Research, draft, review, and finalize."

def get_research_output(task: str, mode: str, planner_output: str) -> str:
    system_prompt = "You are an expert AI Research Agent."
    research_focus = ""
    if mode == "business":
        research_focus = "Include market analysis, target customers, pricing models, risks, and growth opportunities."
    elif mode == "career":
        research_focus = "Include necessary skills, resume points, interview strategies, and a recommended learning path."
    elif mode == "research":
        research_focus = "Include key concepts, credible sources/types of sources to verify, and structured foundational insights."
    elif mode == "project":
        research_focus = "Include key features, recommended tech stack, system architecture, and step-by-step implementation guide."
        
    prompt = f"Task: {task}\nMode: {mode}\nPlanner's Plan:\n{planner_output}\n\nPlease create structured research points based on the plan. {research_focus}"
    try:
        return _call_groq(prompt, system_prompt, 0.4)
    except Exception as e:
        print(f"Research Error: {e}")
        return f"Fallback Research Output:\n- Gathered data on {task}.\n- Focus applied for {mode} mode.\n- Identified key points and resources."

def get_writer_output(task: str, planner_output: str, research_output: str) -> str:
    system_prompt = "You are an expert AI Writer Agent."
    prompt = f"Task: {task}\n\nPlanner's Plan:\n{planner_output}\n\nResearch Data:\n{research_output}\n\nPlease draft a comprehensive, professional, and well-structured document that fulfills the task based on the provided plan and research."
    try:
        return _call_groq(prompt, system_prompt, 0.5)
    except Exception as e:
        print(f"Writer Error: {e}")
        return f"Fallback Writer Output:\nBased on the research and planning for '{task}', this is the drafted output document. It contains the primary content required."

def get_critic_output(task: str, writer_output: str) -> str:
    system_prompt = "You are an expert AI Critic and Review Agent."
    prompt = f"Task: {task}\n\nDraft Document:\n{writer_output}\n\nPlease review the draft. Identify any weak points, inconsistencies, or areas lacking clarity. Suggest specific improvements to make the document more practical, professional, and polished."
    try:
        return _call_groq(prompt, system_prompt, 0.4)
    except Exception as e:
        print(f"Critic Error: {e}")
        return f"Fallback Critic Output:\n- The draft looks decent.\n- Could be more detailed.\n- Ensure professional tone is maintained."

def get_final_answer(task: str, writer_output: str, critic_output: str) -> str:
    system_prompt = "You are an expert AI Editor."
    prompt = f"Task: {task}\n\nOriginal Draft:\n{writer_output}\n\nCritic's Feedback:\n{critic_output}\n\nPlease revise the original draft by incorporating the critic's feedback. Output only the final, polished response without any meta-commentary."
    try:
        return _call_groq(prompt, system_prompt, 0.5)
    except Exception as e:
        print(f"Final Editor Error: {e}")
        return f"Fallback Final Answer:\n{writer_output}\n\n(Note: Critic feedback could not be integrated due to an AI error.)"

def run_agents(task: str, mode: str) -> dict:
    planner_output = get_planner_output(task, mode)
    research_output = get_research_output(task, mode, planner_output)
    writer_output = get_writer_output(task, planner_output, research_output)
    critic_output = get_critic_output(task, writer_output)
    final_answer = get_final_answer(task, writer_output, critic_output)
    
    return {
        "task": task,
        "mode": mode,
        "planner_output": planner_output,
        "research_output": research_output,
        "writer_output": writer_output,
        "critic_output": critic_output,
        "final_answer": final_answer
    }
