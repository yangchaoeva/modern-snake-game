import React, { useEffect, useState } from 'react';

interface FireworkParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
}

interface FireworksProps {
  isActive: boolean;
}

const Fireworks: React.FC<FireworksProps> = ({ isActive }) => {
  const [particles, setParticles] = useState<FireworkParticle[]>([]);
  const [animationId, setAnimationId] = useState<number | null>(null);

  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7',
    '#dda0dd', '#98d8c8', '#f7dc6f', '#bb8fce', '#85c1e9'
  ];

  const createFirework = (x: number, y: number) => {
    const particleCount = 20 + Math.random() * 15; // 增加粒子数量
    const newParticles: FireworkParticle[] = [];
    const color = colors[Math.floor(Math.random() * colors.length)];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
      const velocity = 3 + Math.random() * 5; // 增加初始速度
      const life = 80 + Math.random() * 50; // 增加生命周期

      newParticles.push({
        id: Date.now() + i + Math.random() * 1000,
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        color,
        life,
        maxLife: life
      });
    }

    return newParticles;
  };

  const updateParticles = (prevParticles: FireworkParticle[]) => {
    return prevParticles
      .map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vy: particle.vy + 0.1, // 重力效果
        vx: particle.vx * 0.99, // 空气阻力
        life: particle.life - 1
      }))
      .filter(particle => particle.life > 0);
  };

  useEffect(() => {
    if (!isActive) {
      if (animationId) {
        cancelAnimationFrame(animationId);
        setAnimationId(null);
      }
      setParticles([]);
      return;
    }

    let frameCount = 0;
    const animate = () => {
      frameCount++;
      
      setParticles(prevParticles => {
        let updatedParticles = updateParticles(prevParticles);
        
        // 每15帧创建新的烟花，频率更高
        if (frameCount % 15 === 0) {
          const x = 100 + Math.random() * 600; // 随机x位置
          const y = 100 + Math.random() * 200; // 随机y位置
          const newFirework = createFirework(x, y);
          updatedParticles = [...updatedParticles, ...newFirework];
        }
        
        // 每45帧额外创建一个大型烟花
        if (frameCount % 45 === 0) {
          const x = 200 + Math.random() * 400; // 中心区域
          const y = 80 + Math.random() * 150; // 较高位置
          const bigFirework = createFirework(x, y);
          // 大型烟花有更多粒子
          const extraParticles = createFirework(x + 20, y + 10);
          updatedParticles = [...updatedParticles, ...bigFirework, ...extraParticles];
        }
        
        return updatedParticles;
      });
      
      const id = requestAnimationFrame(animate);
      setAnimationId(id);
    };

    const id = requestAnimationFrame(animate);
    setAnimationId(id);

    return () => {
      if (id) {
        cancelAnimationFrame(id);
      }
    };
  }, [isActive]);

  if (!isActive) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <svg className="w-full h-full">
        {particles.map(particle => {
          const opacity = particle.life / particle.maxLife;
          const size = 2 + (particle.life / particle.maxLife) * 3;
          
          return (
            <circle
              key={particle.id}
              cx={particle.x}
              cy={particle.y}
              r={size}
              fill={particle.color}
              opacity={opacity}
              style={{
                filter: `blur(${1 - opacity}px)`,
                transform: `scale(${opacity})`
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default Fireworks;