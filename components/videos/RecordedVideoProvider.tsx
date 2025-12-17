import React, { createContext, ReactNode, useContext, useState } from 'react';

// Types for the video URIs
export type SwingType = 'dtl' | 'fo';

interface RecordedVideoContextType {
    videos: {
        dtl: string | undefined;
        fo: string | undefined;
    };
    setFoVideo: (uri: string | undefined) => void;
    setDtlVideo: (uri: string | undefined) => void;
    resetVideos: () => void;
}

const RecordedVideoContext = createContext<RecordedVideoContextType | undefined>(undefined);

export const RecordedVideoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [videos, setVideos] = useState<{
        dtl: string | undefined;
        fo: string | undefined;
    }>({ dtl: undefined, fo: undefined });

    const setFoVideo = (uri: string | undefined) => {
        setVideos((prev) => ({ ...prev, fo: uri }));
    };
    const setDtlVideo = (uri: string | undefined) => {
        setVideos((prev) => ({ ...prev, dtl: uri }));
    };

    const resetVideos = () => {
        setVideos({ dtl: undefined, fo: undefined });
    };

    return (
        <RecordedVideoContext.Provider value={{ videos, setFoVideo, setDtlVideo, resetVideos }}>
            {children}
        </RecordedVideoContext.Provider>
    );
};

export const useRecordedVideo = () => {
    const context = useContext(RecordedVideoContext);
    if (!context) {
        return {
            videos: { dtl: undefined, fo: undefined },
            setFoVideo: () => {},
            setDtlVideo: () => {},
            resetVideos: () => {},
        };
    }
    return context;
};
