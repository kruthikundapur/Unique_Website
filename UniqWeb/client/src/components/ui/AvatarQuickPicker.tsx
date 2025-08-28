import { Button } from './button';
import { Card } from './card';
import { useAvatars } from '../../lib/stores/useAvatars';

export function AvatarQuickPicker() {
  const { domains, selectDomain } = useAvatars();

  return (
    <div className="absolute top-24 left-6 z-20 pointer-events-auto">
      <Card className="bg-gray-900/80 border-gray-700 px-4 py-3 flex flex-col gap-3 max-w-[60vw]">
        {domains.map((domain) => (
          <Button
            key={domain.id}
            size="lg"
            variant="secondary"
            className="text-base justify-start items-start h-12"
            onClick={() => selectDomain(domain.id)}
            style={{ backgroundColor: domain.color, color: '#fff' }}
          >
            <div className="flex flex-col leading-tight text-left">
              <span className="font-semibold">{domain.icon} {domain.avatar.name}</span>
              <span className="text-sm opacity-90">{domain.name}</span>
            </div>
          </Button>
        ))}
      </Card>
    </div>
  );
}


