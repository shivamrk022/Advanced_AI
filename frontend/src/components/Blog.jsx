import { motion } from 'framer-motion'
import { FiBookOpen } from 'react-icons/fi'
import Section from './Section'
import { profile } from '../data/profile'

export default function Blog() {
  return (
    <Section
      id="blog"
      eyebrow="Learning Notes"
      title="AI concepts explained simply."
      subtitle="Writing about what I learn — breaking down complex AI topics into clear, practical explanations that anyone can understand."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {profile.blogs.map((post, index) => (
          <motion.article
            key={post.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            className="card-hover rounded-[2rem] border border-white/10 bg-surface/70 p-6"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FiBookOpen />
            </div>
            <h3 className="text-xl font-extrabold text-white">{post.title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">{post.summary}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-400">
                  {tag}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  )
}
