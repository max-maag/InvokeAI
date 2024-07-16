from __future__ import annotations

from contextlib import contextmanager
from dataclasses import dataclass
from typing import TYPE_CHECKING, Callable, Dict, List, Optional

import torch
from diffusers import UNet2DConditionModel

if TYPE_CHECKING:
    from invokeai.backend.stable_diffusion.denoise_context import DenoiseContext


@dataclass
class InjectionInfo:
    type: str
    name: str
    order: Optional[int]
    function: Callable


def callback(name: str, order: int = 0):
    def _decorator(func):
        func.__inj_info__ = {
            "type": "callback",
            "name": name,
            "order": order,
        }
        return func

    return _decorator


class ExtensionBase:
    def __init__(self):
        self.injections: List[InjectionInfo] = []
        for func_name in dir(self):
            func = getattr(self, func_name)
            if not callable(func) or not hasattr(func, "__inj_info__"):
                continue

            self.injections.append(InjectionInfo(**func.__inj_info__, function=func))

    @contextmanager
    def patch_extension(self, context: DenoiseContext):
        yield None

    @contextmanager
    def patch_unet(self, state_dict: Dict[str, torch.Tensor], unet: UNet2DConditionModel):
        yield None
